from django.db import models

class State(models.Model):
    class PortalType(models.TextChoices):
        SHCIL = 'SHCIL', 'SHCIL'
        EGRAM = 'EGRAM', 'E-Gram'
        ONLINE = 'ONLINE', 'Online Portal'

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True, help_text="e.g., HR, GJ")
    portal_type = models.CharField(max_length=20, choices=PortalType.choices, default=PortalType.SHCIL)
    is_enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Article(models.Model):
    class StampFor(models.TextChoices):
        REGISTER = 'REGISTER', 'Registerable'
        NON_REGISTER = 'NON_REGISTER', 'Non-Registerable'

    code = models.CharField(max_length=50, unique=True, help_text="Article Code e.g., ART-4")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    stamp_for = models.CharField(max_length=20, choices=StampFor.choices, default=StampFor.NON_REGISTER)
    
    # State Availability
    is_all_states = models.BooleanField(default=False, help_text="Available in all states?")
    states = models.ManyToManyField(State, blank=True, related_name='articles', help_text="Specific states if not all-India")
    
    base_duty_percentage = models.DecimalField(max_digits=5, decimal_places=2, help_text="Base Duty % if applicable", null=True, blank=True)
    fixed_duty_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Fixed Duty Amount if applicable", null=True, blank=True)

    def __str__(self):
        return f"{self.code} - {self.title}"
