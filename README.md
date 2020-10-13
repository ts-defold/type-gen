# @ts-defold/type-gen
> Typescript type generator for Defold

type-gen is a typescript declarations generator for the [Defold](https://github.com/defold/defold) game engine.
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

Finally, if you would like to use/include the type generator over [@ts-defold/types](https://github.com/ts-defold/types) then simply:
```sh
npx @ts-defold/type-gen
#or
npm install @ts-defold/type-gen
npm run type-gen
```

### Shoutouts 📢
@dasannikov and [DefoldTypescript](https://github.com/dasannikov/DefoldTypeScript) for a starting point and inspiration
[TypeScriptToLoua](https://github.com/TypeScriptToLua/TypeScriptToLua) for the awesome community and tools
@hazzard993, @ark120202, @Perryvw and all the fine folks over on the [tstl discord server](https://discord.gg/BWAq58Y).
<p align="center" class="h4">
  Typescript :heart: Defold
</p>
