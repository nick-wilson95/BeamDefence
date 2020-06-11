namespace BeamDefence.Models
{
    public class RegularEnemy : Enemy
    {
        const int OwnSpeed = 2;
        const int OwnHealth = 30;
        const int OwnRadius = 20;
        const int OwnDamage = 10;
        const int OwnScore = 10;

        public RegularEnemy(int numPlayers) : base(numPlayers, OwnSpeed, OwnHealth, OwnRadius, OwnDamage, OwnScore, EnemyType.RegularEnemy)
        {
        }
    }
}
