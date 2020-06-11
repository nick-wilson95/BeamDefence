using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace BeamDefence
{
    public class Repeater
    {
        private long lastRun = 0;
        private readonly Stopwatch stopwatch = new Stopwatch();
        private readonly Func<Task> action;
        private readonly int intervalMilliseconds;

        public Repeater(Func<Task> action, int intervalMilliseconds)
        {
            this.action = action;
            this.intervalMilliseconds = intervalMilliseconds;
        }

        public async Task Start()
        {
            stopwatch.Start();

            while (true)
            {
                if (stopwatch.ElapsedMilliseconds - lastRun > intervalMilliseconds)
                {
                    await action();
                    lastRun = stopwatch.ElapsedMilliseconds;
                }
            }
        }
    }
}
