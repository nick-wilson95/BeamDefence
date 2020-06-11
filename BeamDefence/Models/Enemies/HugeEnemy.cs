namespace BeamDefence.Models
{
    public class HugeEnemy : Enemy
    {
        const int OwnSpeed = 1;
        const int OwnHealth = 300;
        const int OwnRadius = 60;
        const int OwnDamage = 100;
        const int OwnScore = 150;

        public HugeEnemy(int numPlayers) : base(numPlayers, OwnSpeed, OwnHealth, OwnRadius, OwnDamage, OwnScore, EnemyType.HugeEnemy)
        {
        }
    }
}
