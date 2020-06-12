using System;

namespace BeamDefence
{
    public abstract class Enemy
    {
        private static int counter = 0;

        public EnemyType Type { get; }

        public Position Position { get; set; }

        public bool Arrived { get; private set; } = false;

        public int Id { get; }

        public int Speed { get; }

        public int Radius { get; }

        public int Damage { get; }

        public int Score { get; }

        public int Health { get; protected set; }

        public bool Dead => Health <= 0;

        public Enemy(int numPlayers, int speed, int health, int radius, int damage, int score, EnemyType type)
        {
            Id = counter;
            counter++;

            Type = type;

            Speed = speed;
            Health = (int)Math.Floor(health * Math.Sqrt(numPlayers));
            Radius = radius;
            Damage = damage;
            Score = score;

            int startX = 0, startY = 0;

            var rand = new Random();
            var startingEdge = rand.Next(4);
            switch(startingEdge)
            {
                case 0:
                    startY = rand.Next(GameStateManager.ScreenHeight);
                    break;
                case 1:
                    startX = rand.Next(GameStateManager.ScreenWidth);
                    break;
                case 2:
                    startX = GameStateManager.ScreenWidth;
                    startY = rand.Next(GameStateManager.ScreenHeight);
                    break;
                case 3:
                    startX = rand.Next(GameStateManager.ScreenWidth);
                    startY = GameStateManager.ScreenHeight;
                    break;
            }

            Position = new Position(startX, startY);
        }

        public void ReceiveDamage(int damage)
        {
            Health -= damage;
        }
    }
}
