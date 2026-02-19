from django.contrib import admin
from .models import State, Article

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'is_enabled', 'portal_type')
    search_fields = ('name', 'code')
    list_filter = ('is_enabled', 'portal_type')

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'code', 'stamp_for', 'is_all_states')
    search_fields = ('title', 'code')
    list_filter = ('stamp_for', 'is_all_states', 'states')
    filter_horizontal = ('states',)
