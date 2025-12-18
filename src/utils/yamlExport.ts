// Custom YAML stringifier utility for PRD export
// No external dependencies - simple recursive converter

export const toYaml = (obj: any, indent = 0): string => {
  const spaces = '  '.repeat(indent);
  
  if (obj === null || obj === undefined) {
    return 'null';
  }
  
  if (typeof obj === 'string') {
    // Multi-line strings use block scalar
    if (obj.includes('\n') || obj.length > 80) {
      const lines = obj.split('\n').map(line => spaces + '  ' + line).join('\n');
      return `|\n${lines}`;
    }
    // Escape special characters
    if (obj.match(/[:#{}[\],&*?|<>=!%@\\]/)) {
      return `"${obj.replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj);
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => {
      const value = toYaml(item, indent + 1);
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        return `${spaces}- \n${value}`;
      }
      return `${spaces}- ${value}`;
    }).join('\n');
  }
  
  if (typeof obj === 'object') {
    const entries = Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined);
    if (entries.length === 0) return '{}';
    
    return entries.map(([key, value]) => {
      const yamlValue = toYaml(value, indent + 1);
      const safeKey = key.match(/[:#{}[\],&*?|<>=!%@\s]/) ? `"${key}"` : key;
      
      if (typeof value === 'object' && value !== null && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
        return `${spaces}${safeKey}:\n${yamlValue}`;
      }
      return `${spaces}${safeKey}: ${yamlValue}`;
    }).join('\n');
  }
  
  return String(obj);
};

export const generatePrdYaml = (prdData: any): string => {
  const yaml = `# Calm Magic PRD Export
# Generated: ${new Date().toISOString()}
# Format: YAML (Agentic System Compatible)

${toYaml(prdData)}
`;
  return yaml;
};

export const downloadYaml = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.yaml') ? filename : `${filename}.yaml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
