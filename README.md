# Attic

<img src="./attic-logo.png" alt="attic-logo" />

`But the real interesting stuff is in the cellar and the attic`

## Important commands
- For migrations config, refer: https://typeorm.io/#/using-ormconfig/using-ormconfigjson
- `typeorm migration:create -n PostRefactoring`




## You must know
- `body-parser` is not enabled globally, and recomended to be used on per resource basis
- `bodyParser.urlencoded` is not used at all
- Bespoke middlewares/libraries are preferred over community popularized methods for performance gains and understandibility,
  like
  - https://github.com/FormidableLabs/victory/issues/956 `omit`