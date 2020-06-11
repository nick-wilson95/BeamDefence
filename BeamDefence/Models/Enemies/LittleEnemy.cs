namespace BeamDefence.Models
{
    public class LittleEnemy : Enemy
    {
        const int OwnSpeed = 3;
        const int OwnHealth = 10;
        const int OwnRadius = 15;
        const int OwnDamage = 10;
        const int OwnScore = 15;

        public LittleEnemy(int numPlayers) : base(numPlayers, OwnSpeed, OwnHealth, OwnRadius, OwnDamage, OwnScore, EnemyType.LittleEnemy)
        {
        }
    }
}