"""Fine-grained PAT permission definitions and presets."""

ALL_PERMISSIONS = [
    # Repository permissions
    "actions", "administration", "artifact_metadata", "attestations",
    "security_events", "codespaces", "codespaces_lifecycle_admin",
    "codespaces_metadata", "codespaces_secrets", "statuses", "contents",
    "repository_custom_properties", "vulnerability_alerts",
    "dependabot_secrets", "deployments", "discussions", "environments",
    "issues", "merge_queues", "metadata", "pages", "pull_requests",
    "repository_advisories", "repo_secret_scanning_dismissal_requests",
    "secret_scanning_alerts", "secret_scanning_bypass_requests",
    "secrets", "actions_variables", "repository_hooks", "workflows",
    # Organization permissions
    "organization_api_insights", "organization_administration",
    "organization_user_blocking", "organization_campaigns",
    "org_copilot_content_exclusion", "organization_custom_org_roles",
    "organization_custom_properties", "custom_properties_for_organizations",
    "organization_custom_roles", "organization_events",
    "organization_copilot_seat_management",
    "organization_runner_custom_images", "issue_fields", "issue_types",
    "members", "organization_models",
    "organization_network_configurations", "organization_copilot_metrics",
    "organization_announcement_banners",
    "organization_secret_scanning_bypass_requests",
    "organization_codespaces", "organization_codespaces_secrets",
    "organization_codespaces_settings", "organization_credentials",
    "organization_dependabot_secrets",
    "organization_dependabot_dismissal_requests",
    "organization_code_scanning_dismissal_requests",
    "organization_private_registries", "organization_plan",
    "organization_projects", "secret_scanning_dismissal_requests",
    "organization_secrets", "organization_self_hosted_runners",
    "organization_actions_variables", "organization_hooks",
    # User permissions
    "blocking", "codespaces_user_secrets", "copilot_messages",
    "copilot_editor_context", "user_copilot_requests", "emails",
    "user_events", "followers", "gpg_keys", "gists", "keys",
    "interaction_limits", "user_models", "plan",
    "private_repository_invitations", "profile",
    "git_signing_ssh_public_keys", "starring", "watching",
    # Enterprise permissions
    "enterprise_custom_enterprise_roles", "enterprise_custom_properties",
    "enterprise_ai_controls", "enterprise_copilot_metrics",
    "enterprise_credentials", "enterprise_custom_org_roles",
    "enterprise_custom_properties_for_organizations",
    "enterprise_organizations", "enterprise_people", "enterprise_sso",
]

PERMISSION_PRESETS = {
    "minimal": {},
    "readonly": {
        "contents": "read",
        "metadata": "read",
    },
    "copilot": {
        "copilot_messages": "read",
        "copilot_editor_context": "read",
        "user_copilot_requests": "read",
    },
    "full_repo": {
        "actions": "write",
        "administration": "write",
        "contents": "write",
        "issues": "write",
        "metadata": "read",
        "pull_requests": "write",
        "workflows": "write",
        "secrets": "write",
        "actions_variables": "write",
    },
}


def build_pat_permissions(preset="minimal", custom_perms=None):
    """Build permissions dict. preset as base, custom_perms override."""
    base = PERMISSION_PRESETS.get(preset, {})
    if custom_perms:
        base.update(custom_perms)
    result = {}
    for perm in ALL_PERMISSIONS:
        result[f"integration[default_permissions][{perm}]"] = base.get(perm, "none")
    return result
