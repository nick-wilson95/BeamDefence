using System;

namespace BeamDefence
{
    public class Position
    {
        public Position()
        {
            X = 0;
            Y = 0;
        }
        public Position(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X { get; set; }
        public double Y { get; set; }

        public double DistanceFrom(Position position)
        {
            return Math.Sqrt(
                Math.Pow(X - position.X, 2) + Math.Pow(Y - position.Y, 2)
            );
        }

        public void Lerp(Position target, double amount)
        {
            X += (target.X - X) * amount;
            Y += (target.Y - Y) * amount;
        }
    }
}
