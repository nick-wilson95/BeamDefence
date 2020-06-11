﻿namespace BeamDefence.Models
{
    public class Player
    {
        private static int counter = 0;

        public Player(string connectionId, string name)
        {
            Id = counter;
            counter++;

            ConnectionId = connectionId;
            Name = name;
        }

        public int Id { get; set; }
        public string ConnectionId { get; }
        public string Name { get; }
        public Position Mouse { get; } = new Position();

        public void SetMouse(int x, int y)
        {
            Mouse.X = x;
            Mouse.Y = y;
        }
    }
}
