# SuperTokens Github Actions

This repository contains various actions that SuperTokens uses in its own repositories

## Using actions

All actions get built into individual `.js` files in the `dist` directory. Corresponding `yml` files can be used directly in your actions.

For example to use the docs-versioning action use the following snippet:

```
- uses: supertokens/supertokens-github-actions/docs/versioning@master
```

Make sure to check the `action.yml` file to see if the action expects any input

## Contributing

1. Create your own action by adding an `action.yml` file and an `index.js` file using existing actions as a reference
2. Modify `buildAllActions` to build your action
3. Run `./buildAllActions`
4. Raise a pull request to `supertokens-github-actions`