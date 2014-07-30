from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    code = models.CharField(max_length=100000, default="""// Checks if we've been to all rooms; If so, leave level.
if(this.isLevelExplored())
{
this.descendSpottedStairs();
}
// Checks if player is about to be smashed; if so, cycles through
// the directions object to find a free spot to move to, and moves
// to the first free one. The break doesn't affect execution
        if (this._imminentStrike)
        {
            for (direction in Game.directions)
            {
                if (this.canMove(direction))
                {
                    this.step(direction);
                    break;
                }
            }
        }
//Checks for enemies and attacks first one seen; otherwise explores.
var enemies = this.lookForEnemies();
if(enemies.length>0)
{
var firstEnemy = enemies[0];
this.attackEnemy(firstEnemy);
}
else
{
this.exploreMap();
}  """)
    def __unicode__(self):
        return unicode(self.user)

# Create your models here.
