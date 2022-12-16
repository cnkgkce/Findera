from django.contrib import admin
from .models import Course


# Register your models here.

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'certificate',
                    'rating', 'difficulty', 'enrolled_students', 'price', 'price_category', 'category', 'publish_year', 'duration')

