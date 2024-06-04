# Micro-Frontend Architecture
* The µ-Frontend architecture is implemented using React Module Federation. See [React Micro Frontends with Module Federation](https://www.nearform.com/insights/react-micro-frontends-module-federation/) for more details on this topic.
* For typescript type generation for remote components `@module-federation/typescript` package is used, which provides `FederatedTypesPlugin` class that can be used in `webpack.config.js`. See demo repo for example usage - [module-federation-examples
/typescript](https://github.com/module-federation/module-federation-examples/tree/master/typescript).
    * Types in projects containing components are automatically generated to `./dist/@mf-types` 
    * These types are being automatically pulled by host app during build and placed under `@mf-types` so that views can use strongly typed remote components
# Misc
## Update all deps to latest version
* See https://medium.com/subjective-developer/update-all-node-packages-to-latest-aa128396b92b
* Run `ncu --upgrade`