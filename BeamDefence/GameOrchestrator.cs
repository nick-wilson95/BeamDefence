using BeamDefence.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BeamDefence
{
    public class GameOrchestrator : BackgroundService
    {
        public GameStateManager gameStateManager;
        public IHubContext<GameHub> gameHub;
        private int secondsInWave;

        private int NumPlayers => gameStateManager.players.Count;

        public GameOrchestrator(GameStateManager gameStateManager, IHubContext<GameHub> gameHub)
        {
            this.gameStateManager = gameStateManager;
            this.gameHub = gameHub;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var sendMouseRepeater = new Repeater(SendMouseLocations, 20);
            Task.Run(sendMouseRepeater.Start);

            var progressWaveRepeater = new Repeater(ProgressWave, 1000);
            Task.Run(progressWaveRepeater.Start);

            return Task.CompletedTask;
        }

        private async Task SendMouseLocations()
        {
            await gameHub.Clients.All.SendAsync("updateMousePositions", gameStateManager.players.Select(p => p.Mouse));
        }

        private async Task ProgressWave()
        {
            if (!gameStateManager.Live) return;

            secondsInWave++;

            if (gameStateManager.RemainingWaveEnemies <= 0 && gameStateManager.enemies.Count <= 0)
            {
                StartWave();
                return;
            }

            if (secondsInWave < 4 || secondsInWave % 2 == 1) return;

            var random = new Random();
            var randomInt = 1 + random.Next(gameStateManager.CurrentWave)/2;

            var numToSpawn = Math.Min(randomInt, gameStateManager.RemainingWaveEnemies);
            gameStateManager.RemainingWaveEnemies -= numToSpawn;

            SpawnEnemies(numToSpawn);
        }

        private void StartWave()
        {
            secondsInWave = 0;
            gameStateManager.IncrementWave(gameStateManager.CurrentWave * 4 + 10);
            gameHub.Clients.All.SendAsync("newWave");
        }

        private void SpawnEnemies(int numToSpawn)
        {
            if (!gameStateManager.Live) return;

            var random = new Random();
            var randomInt = random.Next(gameStateManager.CurrentWave);

            var newEnemies = new List<Enemy>();
            for (var i = 0; i < numToSpawn; i++)
            {
                Enemy newEnemy;
                switch (randomInt % 7)
                {
                    case 0:
                        newEnemy = new RegularEnemy(NumPlayers);
                        break;
                    case 1:
                        newEnemy = new LittleEnemy(NumPlayers);
                        break;
                    case 2:
                        newEnemy = new RegularEnemy(NumPlayers);
                        break;
                    case 3:
                        newEnemy = new BigEnemy(NumPlayers);
                        break;
                    case 4:
                        newEnemy = new LittleEnemy(NumPlayers);
                        break;
                    case 5:
                        newEnemy = new BigEnemy(NumPlayers);
                        break;
                    case 6:
                        newEnemy = new HugeEnemy(NumPlayers);
                        break;
                    default:
                        newEnemy = new RegularEnemy(NumPlayers);
                        break;
                }

                gameStateManager.enemies.Add(newEnemy);
                newEnemies.Add(newEnemy);
            }
             
            gameHub.Clients.All.SendAsync("newEnemies", newEnemies);
        }
    }
}
