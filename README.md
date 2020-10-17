# @ts-defold/type-gen
> TypeScript type generator for Defold
<div align="center">
  <a href="https://discord.gg/eukcq5m"><img alt="Chat with us!" src="https://img.shields.io/discord/766898804896038942.svg?colorB=7581dc&logo=discord&logoColor=white"></a>
</div>

type-gen is a TypeScript declarations generator for the [Defold](https://github.com/defold/defold) game engine.
- types are parsed generated from the [offical documentation](https://defold.com/ref/stable/go/)
- types will avoid `any` if they can
- vmath.* types can all be used with number operators through [Intersection Types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)
  - you will need to decorate with an aditional cast upon assignment, but a fair tradeoff vs. vector math function helpers
    ```ts
    function on_update(this:{pos: vmath.vector3, dir: vmath.vector3}, dt: number) {
      const speed = 331;
      this.pos = this.pos + this.dir * speed * dt as vmath.vector3;
    }
    ```
- generated typdoc commnets from lua documentation
- fully generated with no need to manually intervine

## Usage: Install & {}
type-gen was made to generate types for [@ts-defold/types](https://github.com/ts-defold/types) and is included as a dev dependency.
If you are simply wanting typescipt types for your Defold project **@ts-defold/types** is your best bet.
> `npm install -D @ts-defold/types`

If you would like to generate your own types, hack on this project, or contribute in any way, i would suggest you try:
```sh
git clone https://github.com/ts-defold/type-gen.git
cd type-gen
npm install 
npm run build
```

Alternatively, if you would like to just generate your types without the dependency then simply:
```sh
npx @ts-defold/type-gen
#or
npx @ts-defold/type-gen -- defold.d.ts --channel stable --api latest
```

@ts-defold/type-gen can optionally take in arguments:
- **[defold.d.ts]** path to generated output file
- **--channel** [stable | beta | alpha]
- **--api** [latest | 1.2.xxx]

If being used in a project locked to a specific release channel or version of defold you may add configuration settings in your `package.json` instead:
```json
"ts-defold": {
    "channel": "stable",
    "output": "index.d.ts"
},
```

### Shoutouts 📢
[@dasannikov](https://github.com/dasannikov) and [DefoldTypescript](https://github.com/dasannikov/DefoldTypeScript) for a starting point and inspiration
[TypeScriptToLoua](https://github.com/TypeScriptToLua/TypeScriptToLua) for the awesome community and tools
[@hazzard993](https://github.com/hazzard993), [@ark120202](https://github.com/ark120202), [@Perryvw](https://github.com/Perryvw) and all the fine folks over on the [tstl discord server](https://discord.gg/BWAq58Y).
<p align="center" class="h4">
  TypeScript :heart: Defold
</p>
