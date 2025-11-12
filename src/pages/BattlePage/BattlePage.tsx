import React, { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import type {
  BattleAction as Action,
  BattleState as State,
  Enemy,
} from '@/types/pages/battle';

import { Button } from '@/components/atoms/Button/Button';
import { DamageNumber } from '@/components/atoms/DamageNumber/DamageNumber';
import { TurnIndicator } from '@/components/atoms/TurnIndicator/TurnIndicator';
import { PlayerCard } from '@/components/molecules/PlayerCard/PlayerCard';
import { CardHand } from '@/components/organisms/CardHand/CardHand';

import { useGame } from '@/context/GameContext';
import { useModal } from '@/context/ModalContext';
import { usePlayers } from '@/context/PlayersContext';
import enemies from '@/data/enemies.json';
import { useMusicController } from '@/hooks/useMusicContext';
import { persistProgress } from '@/services/progress';

import styles from './BattlePage.module.css';

// ... (reducer and initial state remain the same)

const initialState = (enemyHealth: number): State => ({
  playerHealth: 100,
  playerStamina: 100,
  enemyHealth,
  enemyStamina: 100,
  playerTurn: true,
  playerHand: ['code-review', 'bug-fix', 'refactor'],
  battleLog: [],
});

function reducer(
  state: State & { damageDealt?: number },
  action: Action,
): State & { damageDealt?: number } {
  switch (action.type) {
    case 'PLAY_CARD': {
      if (!state.playerTurn) return state;
      let enemyDamage = 0;
      let staminaCost = 0;
      let log = '';
      switch (action.card) {
        case 'code-review': {
          staminaCost = 10;
          // heal player
          const healed = Math.min(100, state.playerHealth + 12);
          log = `Usaste Code Review y recuperaste ${healed - state.playerHealth} HP.`;
          return {
            ...state,
            playerHealth: healed,
            playerStamina: Math.max(0, state.playerStamina - staminaCost),
            playerTurn: false,
            battleLog: [log, ...state.battleLog],
          };
        }
        case 'bug-fix': {
          staminaCost = 18;
          enemyDamage = 20;
          log = `Usaste Bug Fix (costó ${staminaCost} stamina) y causaste ${enemyDamage} de daño.`;
          return {
            ...state,
            enemyHealth: Math.max(0, state.enemyHealth - enemyDamage),
            playerStamina: Math.max(0, state.playerStamina - staminaCost),
            playerTurn: false,
            battleLog: [log, ...state.battleLog],
            damageDealt: (state.damageDealt || 0) + enemyDamage,
          };
        }
        case 'refactor': {
          staminaCost = 14;
          enemyDamage = 14;
          log = `Usaste Refactor (costó ${staminaCost} stamina) y causaste ${enemyDamage} de daño.`;
          return {
            ...state,
            enemyHealth: Math.max(0, state.enemyHealth - enemyDamage),
            playerStamina: Math.max(0, state.playerStamina - staminaCost),
            playerTurn: false,
            battleLog: [log, ...state.battleLog],
            damageDealt: (state.damageDealt || 0) + enemyDamage,
          };
        }
        default:
          return state;
      }
    }
    case 'ENEMY_ATTACK': {
      // simple fixed attack reduces player health and stamina
      const dmg = 10;
      const st = 8;
      const newPlayerHp = Math.max(0, state.playerHealth - dmg);
      const newPlayerSt = Math.max(0, state.playerStamina - st);
      const log = `El enemigo atacó y causó ${dmg} de daño.`;
      return {
        ...state,
        playerHealth: newPlayerHp,
        playerStamina: newPlayerSt,
        playerTurn: true,
        battleLog: [log, ...state.battleLog],
      };
    }
    case 'REGEN': {
      const regen = 8;
      return {
        ...state,
        playerStamina: Math.min(100, state.playerStamina + regen),
        enemyStamina: Math.min(100, state.enemyStamina + regen),
        battleLog: [`Se regeneraron ${regen} de stamina.`, ...state.battleLog],
      };
    }
    case 'RESET':
      return { ...initialState(50), damageDealt: 0 };
    default:
      return state;
  }
}


export const BattlePage = () => {
  const { state: gameState, dispatch: gameDispatch } = useGame();
  const { updatePlayer } = usePlayers();
  const { showModal, hideModal } = useModal();
  const player = gameState.player;
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const musicController = useMusicController();

  const [handledEnd, setHandledEnd] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<
    { id: string; value: number; top: number; left: number | string }[]
  >([]);

  // Determine enemy from URL param or player progress
  const params = new URLSearchParams(location.search);
  const enemyIdParam = params.get('enemy');
  const allEnemies = enemies as unknown as Enemy[];
  const defeatedList = gameState.player?.defeatedEnemies || [];
  const fallback = allEnemies.find((e) => !defeatedList.includes(e.id));
  const enemy: Enemy =
    (enemyIdParam && allEnemies.find((e) => e.id === enemyIdParam)) ||
    fallback ||
    allEnemies[0];

  const [s, dispatch] = useReducer(reducer, {
    ...initialState(enemy.stats.health),
    damageDealt: 0,
  });

  const handlePlay = (card: string) => {
    dispatch({ type: 'PLAY_CARD', card });
  };

  // Turn and game-end logic
  useEffect(() => {
    if (handledEnd) return;

    if (s.enemyHealth <= 0) {
      setHandledEnd(true);
      musicController.playVictoryMusic();
      const expGained = enemy.difficulty === 'hard' ? 250 : enemy.difficulty === 'medium' ? 120 : 50;

      // Update player state
      gameDispatch({ type: 'AWARD_EXPERIENCE', payload: { enemyId: enemy.id, amount: expGained } });
      gameDispatch({ type: 'INCREMENT_STATS', payload: { battles_won: 1, damage_dealt: s.damageDealt || 0 } });

      // Show Victory Modal
      showModal({
        title: t('battle.victoryTitle', '¡Victoria!'),
        content: t('battle.victoryMessage', `Has derrotado a ${enemy.name} y ganado ${expGained} EXP. Tu viaje continúa.`),
        actions: [
          {
            label: t('battle.mapAction', 'Ir al Mapa'),
            variant: 'primary',
            onClick: () => {
              navigate('/progress');
              hideModal();
            },
          },
          {
            label: t('battle.dashboardAction', 'Ver Dashboard'),
            onClick: () => {
              navigate('/dashboard');
              hideModal();
            },
          },
        ],
      });

      // Persist progress after modal is shown
      setTimeout(() => {
        if (gameState.player) {
          persistProgress(gameState.player).then(() => updatePlayer(gameState.player!.id, {}));
        }
      }, 100);

    } else if (s.playerHealth <= 0) {
      setHandledEnd(true);
      musicController.stopAll();

      // Show Defeat Modal
      showModal({
        title: t('battle.defeatTitle', 'Has sido derrotado'),
        content: t('battle.defeatMessage', 'El código te ha superado esta vez. ¡Pero un desarrollador nunca se rinde!'),
        actions: [
          {
            label: t('battle.retryAction', 'Reintentar'),
            variant: 'primary',
            onClick: () => {
              dispatch({ type: 'RESET' });
              setHandledEnd(false);
              hideModal();
            },
          },
        ],
      });
    }
  }, [s.enemyHealth, s.playerHealth, handledEnd, gameDispatch, showModal, hideModal, navigate, t, enemy, s.damageDealt, musicController, updatePlayer, gameState.player]);

  // ... (other effects for enemy turn, regen, damage numbers remain the same)
  // Enemy turn flow and regen handling
  useEffect(() => {
    // handle regen at start of any turn change
    dispatch({ type: 'REGEN' });
  }, [s.playerTurn]);

  useEffect(() => {
    if (!s.playerTurn) {
      // enemy acts after a short delay
      const t = setTimeout(() => {
        // simple enemy action: attack when has stamina
        if (s.enemyStamina >= 8) {
          dispatch({ type: 'ENEMY_ATTACK' });
        } else {
          // enemy skips - regenerate next turn
          dispatch({ type: 'REGEN' });
          dispatch({ type: 'ENEMY_ATTACK' });
        }
      }, 900);
      return () => clearTimeout(t);
    }
  }, [s.playerTurn, s.enemyStamina]);

  // generate damage numbers when enemy health decreases
  const prevEnemyHp = React.useRef<number>(s.enemyHealth);
  useEffect(() => {
    const prev = prevEnemyHp.current;
    if (s.enemyHealth < prev) {
      const dmg = prev - s.enemyHealth;
      const id = String(Date.now());
      setDamageNumbers((ds) => [
        ...ds,
        { id, value: dmg, top: 80, left: '50%' },
      ]);
    }
    prevEnemyHp.current = s.enemyHealth;
  }, [s.enemyHealth]);

  // log auto-scroll
  const logRef = React.useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [s.battleLog]);


  return (
    <div className={styles.page}>
       <div className={styles.arena}>
        <div className={styles.turnRow}>
          {/* Could show syncing indicator if wanted */}
          <TurnIndicator turn={s.playerTurn ? 'player' : 'enemy'} />
        </div>

        <div className={styles.side}>
          <PlayerCard
            name={player?.name || 'Jugador'}
            avatarUrl={player?.avatarUrl || null}
            level={player?.level || 1}
            health={s.playerHealth}
            stamina={s.playerStamina}
            isActive={s.playerTurn}
            syncing={false} // syncing(player.id) : false}
          />
        </div>

        <div className={styles.side}>
          <PlayerCard
            variant="enemy"
            name={enemy.name}
            avatarUrl={enemy.avatar_url}
            level={1}
            health={s.enemyHealth}
            stamina={s.enemyStamina}
            isActive={!s.playerTurn}
          />
        </div>

        <div className={styles.cardsArea}>
          <CardHand
            cards={s.playerHand}
            onPlay={(card) => {
              handlePlay(card);
            }}
          />
        </div>

        <div className={styles.log} ref={logRef}>
          <h4>Registro</h4>
          <ul>
            {s.battleLog.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>

        <div className={styles.controls}>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            ariaLabel="Atras"
          >
            Atras
          </Button>
          <Button
            onClick={() => dispatch({ type: 'RESET' })}
            ariaLabel={t('battle.reset')}
          >
            {t('battle.reset')}
          </Button>
        </div>

        {/* Damage numbers overlay */}
        <div className={styles.damageLayer} aria-hidden>
          {damageNumbers.map((d) => (
            <DamageNumber
              key={d.id}
              id={d.id}
              value={d.value}
              onDone={(id) =>
                setDamageNumbers((arr) => arr.filter((x) => x.id !== id))
              }
              top={d.top}
              left={typeof d.left === 'number' ? d.left : 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
