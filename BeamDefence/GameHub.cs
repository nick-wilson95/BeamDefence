using BeamDefence.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BeamDefence
{
    public class GameHub : Hub
    {
        private readonly GameStateManager gameStateManager;

        public GameHub(GameStateManager gameStateManager)
        {
            this.gameStateManager = gameStateManager;
        }

        public override Task OnConnectedAsync()
        {
            var newPlayer = new Player(Context.ConnectionId, "name");

            gameStateManager.players.Add(newPlayer);

            Clients.Caller.SendAsync("receiveId", newPlayer.Id);
            Clients.Others.SendAsync("newPlayer", newPlayer);

            return Task.CompletedTask;
        }

        public async override Task OnDisconnectedAsync(Exception _)
        {
            if (gameStateManager.TryGetPlayer(Context.ConnectionId, out var player))
            {
                await Clients.All.SendAsync("playerLeft", player.Id);
                gameStateManager.players.Remove(player);
            }

            if (!gameStateManager.players.Any())
            {
                gameStateManager.Reset();
            }
        }

        public async Task StartGame()
        {
            this.gameStateManager.StartGame();
            await Clients.All.SendAsync("gameStarted");
        }

        public async Task GetPlayers()
        {
            await Clients.Caller.SendAsync("receivePlayers", gameStateManager.players);
        }

        public async Task GetEnemies()
        {
            await Clients.Others.SendAsync("sendEnemiesForConnection", Context.ConnectionId);
            gameStateManager.ConnectionsAwaitingEnemies.Add(Context.ConnectionId);
        }

        public async Task SendEnemiesForConnection(EnemyPosition[] positions, string connectionId)
        {
            if (!gameStateManager.ConnectionsAwaitingEnemies.Contains(connectionId)) return;

            gameStateManager.ConnectionsAwaitingEnemies.Remove(connectionId);
            gameStateManager.UpdateEnemyPositions(positions);
            await Clients.Client(connectionId).SendAsync("receiveEnemies", gameStateManager.enemies);
        }

        public async Task GetGameState()
        {
            await Clients.Caller.SendAsync("receiveGameState", gameStateManager.Live);
        }

        public void SendMouse(int mouseX, int mouseY, bool mousePressed)
        {
            if (gameStateManager.TryGetPlayer(Context.ConnectionId, out var player))
            {
                player.SetMouse(mouseX, mouseY, mousePressed);
            }
        }

        public async Task DamageEnemy(int enemyId, int amount)
        {
            if (gameStateManager.TryGetEnemy(enemyId, out Enemy enemy))
            {
                enemy.ReceiveDamage(amount);

                if (enemy.Dead)
                {
                    gameStateManager.enemies.Remove(enemy);
                    await Clients.All.SendAsync("enemyDead", enemyId);
                }
            }
        }

        public async Task EnemyArrived(int enemyId)
        {
            if (gameStateManager.TryGetEnemy(enemyId, out Enemy enemy))
            {
                gameStateManager.DamageNexus(enemy.Damage);

                gameStateManager.enemies.Remove(enemy);
                await Clients.All.SendAsync("enemyArrived", enemy.Id);
            }
        }
    }
}
