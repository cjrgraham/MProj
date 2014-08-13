from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    code = models.CharField(max_length=100000, default="""//this.raiseShield();
// Checks if we've been to all rooms; If so, leave level.
//if(this.isLevelExplored())
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
var enemies = this.lookForItem();
if(enemies.length>0)
{
var firstEnemy = enemies[0];
var a = this.goTo(firstEnemy);
if (a)
{
Game.queMessage("here");
 this.pickUp();
}
}
else
{
this.exploreMap();
}              
if(this._curr_health<450)
this.drinkPotion();   """)
    def __unicode__(self):
        return unicode(self.user)

# Create your models here.
