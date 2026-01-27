import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    'installation',
    'quick-start',
    {
      type: 'category',
      label: 'CLI Reference',
      items: [
        'cli/index',
        'cli/scan',
        'cli/fix',
        'cli/report',
      ],
    },
    {
      type: 'category',
      label: 'Scanners',
      items: [
        'scanners/index',
        'scanners/phi',
        'scanners/encryption',
        'scanners/audit',
        'scanners/access',
        'scanners/retention',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'configuration/index',
        'configuration/yaml-rules',
        'configuration/ignore-patterns',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'integrations/index',
        'integrations/vscode',
        'integrations/github-actions',
        'integrations/gitlab-ci',
      ],
    },
    {
      type: 'category',
      label: 'HIPAA Reference',
      items: [
        'hipaa/index',
        'hipaa/security-rule',
        'hipaa/privacy-rule',
      ],
    },
    'contributing',
  ],
};

export default sidebars;
