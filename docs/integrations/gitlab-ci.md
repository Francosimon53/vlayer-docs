---
sidebar_position: 4
title: GitLab CI
---

# GitLab CI

Integrate vlayer into your GitLab CI/CD pipeline for automated HIPAA compliance checks.

## Quick Start

Add to `.gitlab-ci.yml`:

```yaml
hipaa-compliance:
  image: node:20
  stage: test
  script:
    - npx vlayer scan . --fail-on high
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"
```

## Full Configuration

### With Reports and Artifacts

```yaml
stages:
  - test
  - compliance

variables:
  NODE_VERSION: "20"

hipaa-compliance:
  image: node:${NODE_VERSION}
  stage: compliance
  before_script:
    - npm ci
  script:
    - npx vlayer scan . -f json -o vlayer-results.json
    - npx vlayer report generate vlayer-results.json -f html -o hipaa-report.html
  artifacts:
    when: always
    paths:
      - vlayer-results.json
      - hipaa-report.html
    reports:
      codequality: vlayer-results.json
    expire_in: 30 days
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH == "develop"
```

### Code Quality Integration

GitLab can display vlayer findings in the Code Quality report:

```yaml
hipaa-compliance:
  image: node:20
  stage: test
  script:
    - npx vlayer scan . -f gitlab -o gl-code-quality-report.json
  artifacts:
    reports:
      codequality: gl-code-quality-report.json
```

This shows findings directly in merge request diffs.

### Merge Request Comments

Post findings as MR comments:

```yaml
hipaa-compliance:
  image: node:20
  stage: test
  script:
    - npx vlayer scan . -f json -o results.json
    - |
      if [ -f results.json ]; then
        FINDINGS=$(jq '.findings | length' results.json)
        if [ "$FINDINGS" -gt 0 ]; then
          echo "## HIPAA Compliance Report" > comment.md
          echo "" >> comment.md
          echo "Found $FINDINGS issue(s):" >> comment.md
          jq -r '.findings[] | "- **\(.severity)**: \(.message) at \(.file):\(.line)"' results.json >> comment.md

          curl --request POST \
            --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
            --header "Content-Type: application/json" \
            --data "{\"body\": \"$(cat comment.md | sed 's/"/\\"/g' | tr '\n' ' ')\"}" \
            "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes"
        fi
      fi
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

### Multi-Stage Pipeline

```yaml
stages:
  - build
  - test
  - compliance
  - deploy

compliance:scan:
  image: node:20
  stage: compliance
  script:
    - npx vlayer scan . -f json -o results.json --fail-on critical
  artifacts:
    paths:
      - results.json
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

compliance:report:
  image: node:20
  stage: compliance
  needs:
    - compliance:scan
  script:
    - npx vlayer report generate results.json -f html -o report.html
  artifacts:
    paths:
      - report.html
    expire_in: 90 days
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:production:
  stage: deploy
  needs:
    - compliance:scan
  script:
    - echo "Deploying to production..."
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
  environment:
    name: production
```

### Scheduled Audits

```yaml
scheduled-audit:
  image: node:20
  stage: compliance
  script:
    - npx vlayer scan . -f html -o weekly-audit.html --include-passing
  artifacts:
    paths:
      - weekly-audit.html
    expire_in: 365 days
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
```

Create schedule in CI/CD → Schedules.

## Environment Variables

Configure vlayer behavior:

```yaml
variables:
  VLAYER_SEVERITY: "medium"
  VLAYER_FAIL_ON: "high"
  VLAYER_CONFIG: ".vlayerrc.ci.json"

hipaa-compliance:
  script:
    - npx vlayer scan .
```

## Caching

Speed up pipelines with caching:

```yaml
hipaa-compliance:
  image: node:20
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
      - .npm/
  before_script:
    - npm ci --cache .npm --prefer-offline
  script:
    - npx vlayer scan .
```

## Protected Branches

Require compliance checks before merging:

1. Go to Settings → Repository → Protected branches
2. Select your branch
3. Set "Allowed to merge" to maintainers
4. Enable "Require approval from code owners"

In `CODEOWNERS`:
```
# Require compliance team approval for PHI-related changes
/src/patient/**  @compliance-team
/src/medical/**  @compliance-team
```

## GitLab Pages Report

Host compliance reports on GitLab Pages:

```yaml
pages:
  image: node:20
  stage: deploy
  script:
    - npx vlayer scan . -f html -o public/index.html
    - npx vlayer scan . -f json -o public/results.json
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

Access at `https://<username>.gitlab.io/<project>/`

## Troubleshooting

### Pipeline Fails Silently

Add verbose output:

```yaml
script:
  - npx vlayer scan . --verbose
```

### Exit Code Issues

Check exit codes:

```yaml
script:
  - npx vlayer scan . || echo "Exit code: $?"
```

### Permissions Issues

Ensure token has API access for MR comments:

```yaml
variables:
  GITLAB_TOKEN: $CI_JOB_TOKEN  # or use a project token
```

## See Also

- [GitHub Actions](./github-actions) - GitHub CI setup
- [Configuration](../configuration/) - CI configuration options
