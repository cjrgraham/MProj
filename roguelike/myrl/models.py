from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    code = models.CharField(max_length=100000)
    def __unicode__(self):
        return unicode(self.user)

# Create your models here.
