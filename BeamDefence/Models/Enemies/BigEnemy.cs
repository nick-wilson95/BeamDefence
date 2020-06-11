namespace BeamDefence.Models
{
    public class BigEnemy : Enemy
    {
        const int OwnSpeed = 1;
        const int OwnHealth = 100;
        const int OwnRadius = 40;
        const int OwnDamage = 20;
        const int OwnScore = 20;

        public BigEnemy(int numPlayers) : base(numPlayers, OwnSpeed, OwnHealth, OwnRadius, OwnDamage, OwnScore, EnemyType.BigEnemy)
        {
        }
    }
}
