using BeamDefence.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BeamDefence
{
    public class GameStateManager
    {
        public const int ScreenWidth = 1440;
        public const int ScreenHeight = 810;

        public static Position GameCentre { get; set; } = new Position(ScreenWidth / 2, ScreenHeight / 2);

        public readonly List<Player> players = new List<Player>();
        public readonly List<Enemy> enemies = new List<Enemy>();

        public bool Live { get; private set; } = false;
        public int CurrentWave { get; private set; } = 0;
        public int RemainingWaveEnemies { get; set; } = 0;
        public double NexusHealth { get; private set; }
        public bool NexusDead { get; private set; } = false;

        public List<string> ConnectionsAwaitingEnemies { get; set; } = new List<string>();

        public void StartGame()
        {
            if (Live) return;

            Live = true;
            NexusHealth = 100;
        }

        public void Reset()
        {
            enemies.Clear();
            Live = false;
            CurrentWave = 0;
            RemainingWaveEnemies = 0;
            ConnectionsAwaitingEnemies.Clear();

            NexusDead = false;
        }

        public bool TryGetPlayer(string connectionId, out Player player)
        {
            player = players.FirstOrDefault(p => p.ConnectionId == connectionId);

            return player != default;
        }

        public bool TryGetEnemy(int id, out Enemy enemy)
        {
            enemy = enemies.FirstOrDefault(e => e.Id == id);

            return enemy != default;
        }

        public void HealNexus(double healing)
        {
            NexusHealth += healing;

            if (NexusHealth > 100) NexusHealth = 100;
        }

        public void DamageNexus(double damage)
        {
            NexusHealth -= damage;

            if (NexusHealth <= 0) NexusDead = true;
        }

        public void IncrementWave(int nextWaveNumEnemies)
        {
            CurrentWave++;
            RemainingWaveEnemies = nextWaveNumEnemies;
        }

        public void UpdateEnemyPositions(EnemyPosition[] positions)
        {
            positions.Join(
                enemies,
                p => p.Id,
                e => e.Id,
                (p, e) => {
                    e.Position.X = p.X;
                    e.Position.Y = p.Y;
                    return new { };
                }
            );
        }
    }
}