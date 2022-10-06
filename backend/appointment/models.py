from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles
from pygments.lexers import get_lexer_by_name
from pygments.formatters.html import HtmlFormatter
from pygments import highlight


class Appoitment(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    part_of_body = models.CharField(max_length=100, blank=False)
    description = models.TextField()
    noticed_symptoms_when = models.CharField(default='today', max_length=100)
    owner = models.ForeignKey('users.User', related_name='appoitment', on_delete=models.CASCADE)
    highlighted = models.TextField()

    class Meta:
        ordering = ['created']