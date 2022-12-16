from django.db import models

# Create your models here.


class Course(models.Model):
    title = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)
    certificate = models.CharField(max_length=255)
    rating = models.FloatField()
    difficulty = models.CharField(max_length=255)
    enrolled_students = models.IntegerField()
    price = models.IntegerField()
    price_category = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    publish_year = models.CharField(max_length=255)
    duration = models.CharField(max_length=255)
