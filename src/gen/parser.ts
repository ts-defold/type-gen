import * as schema from '../types/schema';

export interface ParserOpts {
  log: unknown;
}

function parseHtml(input: string, isParam?: boolean): string {
  const icons: Record<string, string> = {
    attention: '⚠',
    html5: '🌎',
    android: '🤖',
    ios: '📱',
    macos: '🍎',
    linux: '🐧',
  };
  const icon = /.*<span class="icon-(.*)">.*<\/span>/.exec(input)?.[1];

  return input
    .replace(/\\n<ul>/g, '')
    .replace(/.*<li>(.*)<\/li>/g, '- $1')
    .replace(/<\/?em>/g, '*')
    .replace(/<\/?code>/g, '`')
    .replace(/.*<span class="type">(.+)<\/span>(\s*)/g, isParam ? '' : '$1')
    .replace(/.*<span class="icon-(.*)">.*<\/span>/g, icon ? icons[icon] : '')
    .replace(/<.*?>/g, '');
}

function parseType(
  type: schema.EDocParamType[],
  doc: string,
  typeMap: Record<string, schema.EDocParamType>
): schema.EDocParamType[] {
  const types: schema.EDocParamType[] = [];

  if (type) {
    const providedTypes = type.map((t) => {
      const key = typeMap[t];
      return schema.reverseTypeMap[key ? key : '']
        ? (schema.reverseTypeMap[key ? key : ''] as schema.EDocParamType)
        : schema.EDocParamType.Unknown;
    });
    types.push(...providedTypes);
  } else if (doc) {
    const result = /.*<span class="type">(.+)<\/span>/.exec(doc);
    if (result && result.length > 1) {
      const inferredTypes = result[1]
        .split('|')
        .map((t) => t.trim())
        .map((t) => {
          const key = typeMap[t];
          return schema.reverseTypeMap[key ? key : '']
            ? (schema.reverseTypeMap[key ? key : ''] as schema.EDocParamType)
            : schema.EDocParamType.Unknown;
        });
      types.push(...inferredTypes);
    }
  }

  return types;
}

function parseName(
  input: string,
  description: string
): { name: string; optional: boolean } {
  const maybeOptional = /\[(.+)\]/.exec(input);
  const optional = maybeOptional && maybeOptional?.length > 1 ? true : false;
  const rawName = optional && maybeOptional ? maybeOptional[1] : input;
  const name = rawName.replace(/^[^a-zA-Z_$]|[^0-9a-zA-Z_$]/g, '_');
  const altOptional = description.indexOf('optional') > -1;
  if (name == 'options') console.log(altOptional, description);
  return { name, optional: optional || altOptional };
}

function inNamespace(doc: schema.IDocJson): boolean {
  let hasFunction = false;
  const funcNamespace =
    undefined !=
    doc.elements.find((e) => {
      if (e.type == schema.EDocElemType.Function) {
        hasFunction = true;
        return e.name.startsWith(doc.info.namespace);
      }
    });

  return !hasFunction || funcNamespace;
}

const defaults = [
  { group: schema.EDocGroup.System },
  { group: schema.EDocGroup.Script },
  { group: schema.EDocGroup.Components },
  { group: schema.EDocGroup.Extensions },
  { group: schema.EDocGroup.Lua, includes: ['socket'] },
];
export function parse(
  input: Array<schema.IDocJson>,
  groups: Array<schema.IDocGroupFilter> = defaults,
  typeMap?: Record<string, schema.EDocParamType>
): Array<schema.IDocJson> {
  const userTypeMap = Object.assign(schema.typeMap, typeMap || {});
  const alphabetical = input
    .slice()
    .sort((a, b) => a.info.namespace.localeCompare(b.info.namespace));
  const filtered = alphabetical.filter((doc) => {
    const group = groups.find((g) => g.group == doc.info.group);
    if (group) {
      if (group.include) {
        return group.include.includes(doc.info.namespace);
      } else if (group.exclude) {
        return !group.exclude.includes(doc.info.namespace);
      }
      return true;
    }
    return false;
  });
  const grouped = filtered
    .slice()
    .sort(
      (a, b) =>
        groups.findIndex((g) => g.group === a.info.group) -
        groups.findIndex((g) => g.group === b.info.group)
    );

  return grouped.map((doc) => {
    const elements = doc.elements.map((el) => {
      return {
        type: el.type,
        name: el.name,
        brief: parseHtml(el.brief),
        description: parseHtml(el.description),
        parameters: el.parameters.map((p) => {
          const ext = parseName(p.name, p.doc);
          return {
            name: ext.name,
            types: parseType(p.types, p.doc, userTypeMap),
            doc: parseHtml(p.doc, true),
            optional: ext.optional,
          };
        }),
        returnvalues: el.returnvalues.map((r) => {
          const ext = parseName(r.name, '');
          return {
            name: ext.name,
            types: parseType(r.types, r.doc, userTypeMap),
            doc: parseHtml(r.doc, true),
            optional: ext.optional,
          };
        }),
      };
    });

    const info: schema.IDocInfo = {
      group: doc.info.group,
      namespace: inNamespace(doc) ? doc.info.namespace : '',
      description: parseHtml(doc.info.description),
    };

    return { info, elements };
  });
}
