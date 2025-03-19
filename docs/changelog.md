---
layout: default
title: Changelog
permalink: /releases/changelog
---

# Changelog

## 19.0.4

The release script failed half-way in 19.0.3, so re-releasing.

- [`da67311a`](https://github.com/sinonjs/sinon/commit/da67311a3eeff7df47ac13af21a7331e523b433a)
  Revert "Add version 19.0.3 to releases" (Carl-Erik Kopseng)
- [`84d5c82a`](https://github.com/sinonjs/sinon/commit/84d5c82a67218f12745e018c930bb3b988f41f25)
  Add version 19.0.3 to releases (Carl-Erik Kopseng)

_Released by Carl-Erik Kopseng on 2025-03-19._

## 19.0.3

Basically just documentation updates

- [`1f1d3706`](https://github.com/sinonjs/sinon/commit/1f1d3706c07e70fc29b111844025c74e48f83284)
  Verifying links procedure (Carl-Erik Kopseng)
- [`37623efc`](https://github.com/sinonjs/sinon/commit/37623efc5118f1eeb9a7df28694997412bcd38b1)
  Catch latest two missing redirects (Carl-Erik Kopseng)
- [`2404a45f`](https://github.com/sinonjs/sinon/commit/2404a45feeae904a286b3d6321d22ef2cdb08e93)
  Ignore ancient deadlinks to Sinon child projects in previous releases (Carl-Erik Kopseng)
- [`fba6f877`](https://github.com/sinonjs/sinon/commit/fba6f877b04a1ced5533c050724ecc4e9aba9df6)
  Ignore historic links in changelog (Carl-Erik Kopseng)
- [`e3950d9b`](https://github.com/sinonjs/sinon/commit/e3950d9b391b26e684a1add77da2f70fdd1cdc6d)
  Fix external link (Carl-Erik Kopseng)
- [`0be40825`](https://github.com/sinonjs/sinon/commit/0be4082548f206e0e6f2b02b84b190e04e137fd1)
  Fix the missing redirects to the migration guide (Carl-Erik Kopseng)
- [`108fbca0`](https://github.com/sinonjs/sinon/commit/108fbca09ccccac6521ba48fd4030a762d498e11)
  Fix internal ../assertions link in source (Carl-Erik Kopseng)
- [`bb10e53a`](https://github.com/sinonjs/sinon/commit/bb10e53a905a60cca2d2ec59d2205e8453214899)
  Fix spy-call reference in source (Carl-Erik Kopseng)
- [`ef582e31`](https://github.com/sinonjs/sinon/commit/ef582e319a89ced90c5c259657900aa4cf2c88b5)
  Remove bash-ism from Makefile (use POSIX) (Carl-Erik Kopseng)
- [`7af1d235`](https://github.com/sinonjs/sinon/commit/7af1d23581d2c8c7625e248a9bdfb2767f12ef98)
  chore: remove .unimportedrc.json (Morgan Roderick)
- [`dfcad710`](https://github.com/sinonjs/sinon/commit/dfcad71008a751f151063d7a739590e847a338d9)
  chore: fix codecov upload (Morgan Roderick)
  > We are seeing errors uploading coverage reports to codecov:
  >
  > ```
  > Rate limit reached. Please upload with the Codecov repository upload token to resolve issue
  > ```
  >
  > I've added a repository token, as instructed in https://docs.codecov.com/docs/adding-the-codecov-token.
  >
  > This changeset should fix the upload issue.
- [`0ca2e49e`](https://github.com/sinonjs/sinon/commit/0ca2e49e857ec6b10ed4134944cdf591a0065965)
  fix: browser-test job fails in ubuntu-latest (Morgan Roderick)
- [`e9eb2eb2`](https://github.com/sinonjs/sinon/commit/e9eb2eb26e873f106a9996610a142d25d917d9e8)
  chore: remove unused unused job (Morgan Roderick)
  > This crucial part of this workflow was removed in
  > 278e667e095cd1a666c3ab2dc4268379a5754598, we should have removed the entire job.
- [`278e667e`](https://github.com/sinonjs/sinon/commit/278e667e095cd1a666c3ab2dc4268379a5754598)
  chore: remove unimported (Morgan Roderick)
  > The repository has been archived. See https://github.com/smeijer/unimported
- [`9e30835b`](https://github.com/sinonjs/sinon/commit/9e30835bb7c7bb550ed299a4102fdd53a23b083f)
  npm audit (Morgan Roderick)
- [`a74301cf`](https://github.com/sinonjs/sinon/commit/a74301cff8e7fb42ebb164c91d059ab391741473)
  chore: remove RunKit (Morgan Roderick)
  > This service is dead.
- [`80bc1d96`](https://github.com/sinonjs/sinon/commit/80bc1d96371580a8b2dad39122db46933e7f5884)
  Fix out-of-date fake-timers docs (#2628) (Carl-Erik Kopseng)
  > - Fix documentation issue for fake-timers mentioned in #2625
  >
  > The docs were out of sync with the fake-timers docs.
  >
  > - Update dependencies before new patch version
- [`527568cc`](https://github.com/sinonjs/sinon/commit/527568cc60a3c30359732bbb02806cee47a33d02)
  Bump rexml from 3.3.7 to 3.3.9 (#2626) (dependabot[bot])
  > Bumps [rexml](https://github.com/ruby/rexml) from 3.3.7 to 3.3.9.
  >
  > - [Release notes](https://github.com/ruby/rexml/releases)
  > - [Changelog](https://github.com/ruby/rexml/blob/master/NEWS.md)
  > - [Commits](https://github.com/ruby/rexml/compare/v3.3.7...v3.3.9)
  >
  > ***
  >
  > updated-dependencies:
  >
  > - dependency-name: rexml
  >
  >   dependency-type: indirect
  >
  > ...
  >
  > Signed-off-by: dependabot[bot] <support@github.com>
  >
  > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`ed029725`](https://github.com/sinonjs/sinon/commit/ed0297257413b728bc31515ac0a87e738e069961)
  Bump webrick from 1.8.1 to 1.8.2 (#2623) (dependabot[bot])
  > Bumps [webrick](https://github.com/ruby/webrick) from 1.8.1 to 1.8.2.
  >
  > - [Release notes](https://github.com/ruby/webrick/releases)
  > - [Commits](https://github.com/ruby/webrick/compare/v1.8.1...v1.8.2)
  >
  > ***
  >
  > updated-dependencies:
  >
  > - dependency-name: webrick
  >
  >   dependency-type: indirect
  >
  > ...
  >
  > Signed-off-by: dependabot[bot] <support@github.com>
  >
  > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>

_Released by Carl-Erik Kopseng on 2025-03-19._

## 19.0.2

- [`4eb4c4bc`](https://github.com/sinonjs/sinon/commit/4eb4c4bc0266d90d1624e5067029599ed57f7fb2)
  Use fix 13.0.2 version of fake-timers to get Date to pass instanceof checks (Carl-Erik Kopseng)
- [`a5b03db3`](https://github.com/sinonjs/sinon/commit/a5b03db3af8948fe57c9f6818d7ae51fdef7ab52)
  Add links to code that is affected by the breaking changes (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2024-09-13._

## 19.0.1

- [`037ec2d2`](https://github.com/sinonjs/sinon/commit/037ec2d2a995fb1f84f7b63ed00e632316648612)
  Update migration docs (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2024-09-13._

## 19.0.0

- [`3534ab4f`](https://github.com/sinonjs/sinon/commit/3534ab4fb02803173d9ca34f6020c3701d82abc9)
  Bump samsam and nise to latest versions (#2617) (Carl-Erik Kopseng)
  > Ensures consistency and less breakage when there are "circular" dependencies.
- [`912c568d`](https://github.com/sinonjs/sinon/commit/912c568d3038dc0bea0e8a7b25e4298087c7c99c)
  upgrade fake timers and others (#2612) (Carl-Erik Kopseng)
  > - Upgrade dependencies (includes breaking API in Fake Timers)
  > - fake-timers: no longer creating dates using the original Date class, but a subclass (proxy)
- [`9715798e`](https://github.com/sinonjs/sinon/commit/9715798e30e59b110a1349cd0bd087b0fa5f9af2)
  Use newer @mochify/\* packages (#2609) (Carl-Erik Kopseng)
  > Co-authored-by: Maximilian Antoni <mail@maxantoni.de>

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2024-09-13._

## 18.0.1

Basically a patch release to update a transitive dependency in Nise.

- [`03e33ec6`](https://github.com/sinonjs/sinon/commit/03e33ec6475d7e7acfe62676af63eb2344cd6db0)
  Pin fake-timers@11.2.2 to avoid breaking change (Carl-Erik Kopseng)
- [`5a7924ad`](https://github.com/sinonjs/sinon/commit/5a7924ad94f37b9985899fc8a1dbfd29cbdd7967)
  Add createStubInstance header in stubs.md (Daniel Kaplan)
- [`ad6804cd`](https://github.com/sinonjs/sinon/commit/ad6804cd4143eaaaa8f989dae20dbf7295444893)
  Bump elliptic from 6.5.5 to 6.5.7 (#2608) (dependabot[bot])
- [`033287bd`](https://github.com/sinonjs/sinon/commit/033287bded8dfce16653b33292ef2fef9ed487b0)
  Bump path-to-regexp and nise (#2611) (dependabot[bot])
  > Bumps [path-to-regexp](https://github.com/pillarjs/path-to-regexp) to 8.1.0 and updates ancestor dependency [nise](https://github.com/sinonjs/nise). These dependencies need to be updated together.
  >
  > Updates `path-to-regexp` from 6.2.2 to 8.1.0
  >
  > - [Release notes](https://github.com/pillarjs/path-to-regexp/releases)
  > - [Changelog](https://github.com/pillarjs/path-to-regexp/blob/master/History.md)
  > - [Commits](https://github.com/pillarjs/path-to-regexp/compare/v6.2.2...v8.1.0)
  >
  > Updates `nise` from 6.0.0 to 6.0.1
  >
  > - [Changelog](https://github.com/sinonjs/nise/blob/main/History.md)
  > - [Commits](https://github.com/sinonjs/nise/commits)
  >
  > ***
  >
  > updated-dependencies:
  >
  > - dependency-name: path-to-regexp
  >
  >   dependency-type: indirect
  >
  > - dependency-name: nise
  >
  >   dependency-type: direct:production
  >
  > ...
  >
  > Signed-off-by: dependabot[bot] <support@github.com>
  >
  > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`0c609f95`](https://github.com/sinonjs/sinon/commit/0c609f95b1f4f18e02896b5a87bbc59f5787093e)
  re-add testing of esm browser builds (Carl-Erik Kopseng)
  > It seems unclear why it was removed in the first place: I have tested extensively that it
  > does work and it does fail the build if changing any assertion in the script
- [`da4230a0`](https://github.com/sinonjs/sinon/commit/da4230a00c929f56738d272da469a5ecb9d40da7)
  Bump braces from 3.0.2 to 3.0.3 (#2605) (dependabot[bot])
  > Bumps [braces](https://github.com/micromatch/braces) from 3.0.2 to 3.0.3.
  >
  > - [Changelog](https://github.com/micromatch/braces/blob/master/CHANGELOG.md)
  > - [Commits](https://github.com/micromatch/braces/compare/3.0.2...3.0.3)
  >
  > ***
  >
  > updated-dependencies:
  >
  > - dependency-name: braces
  >
  >   dependency-type: indirect
  >
  > ...
  >
  > Signed-off-by: dependabot[bot] <support@github.com>
  >
  > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`02542370`](https://github.com/sinonjs/sinon/commit/02542370a4d92ef12270638f97db29ca4f1cca66)
  feat(ci): add node v22 (#2600) (Rotzbua)
- [`794cb81a`](https://github.com/sinonjs/sinon/commit/794cb81a3bf639c8fb0880f4509a5a1a42066b6e)
  fix(tests): typo (#2603) (Rotzbua)
- [`1eb2a254`](https://github.com/sinonjs/sinon/commit/1eb2a25486564ff6b834cfe0a62329dd8bd455fe)
  Use NodeJS 22.2.0 as base development version (Carl-Erik Kopseng)
- [`1aa713fd`](https://github.com/sinonjs/sinon/commit/1aa713fd413e1b34645fddff1871da99c6d263f8)
  Bump rexml from 3.2.5 to 3.2.8 (#2599) (dependabot[bot])
  > Bumps [rexml](https://github.com/ruby/rexml) from 3.2.5 to 3.2.8. >
  >
  > - [Release notes](https://github.com/ruby/rexml/releases) >
  > - [Changelog](https://github.com/ruby/rexml/blob/master/NEWS.md) >
  > - [Commits](https://github.com/ruby/rexml/compare/v3.2.5...v3.2.8) > >
  >   --- >
  >   updated-dependencies: >
  > - dependency-name: rexml >
  >   dependency-type: indirect >
  >   ... > >
  >   Signed-off-by: dependabot[bot] <support@github.com> >
  >   Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2024-09-10._

## 18.0.0

This is what 17.0.2 should have been, as that contained two breaking changes. After updating
Nise we are down to one breaking change, which only affects sinon-test (which has been updated),
so most people are not affected. The legacyRoutes flag that is currently enabled in Nise by default
will at some later version be disabled. We will then issue a little migration note.

- [`01d45312`](https://github.com/sinonjs/sinon/commit/01d45312e82bbd0b2f435f16bd4a834b98d08e11)
  Use Nise 6 with legacyRoutes flag enabled (Carl-Erik Kopseng)
  > This should be disabled in a future Sinon version by default.
- [`c618edc5`](https://github.com/sinonjs/sinon/commit/c618edc51e0302f047914e121cb788ac9cc43382)
  fix #2594: remove needless sandbox creation (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2024-05-15._

## 17.0.2

- [`f6dca0ba`](https://github.com/sinonjs/sinon/commit/f6dca0bac3f228fa917165eca8815d5e2b8a6793)
  upgrade packages (#2595) (Carl-Erik Kopseng)
- [`5025d001`](https://github.com/sinonjs/sinon/commit/5025d001401091fd2086cfa2ec69e40cc0da9b65)
  Avoid return and callArg\* clearing each other's state (#2593) (Carl-Erik Kopseng)
  > - Partially revert "fix returns does not override call through (#2567)"
  >
  > * revert to the old manual clearing of props
- [`ed068a88`](https://github.com/sinonjs/sinon/commit/ed068a886fa37cbd5f886d355824debd69aa1b16)
  Bump ip from 1.1.8 to 1.1.9 (#2587) (dependabot[bot])
- [`ec4d592e`](https://github.com/sinonjs/sinon/commit/ec4d592ee4faf87d7e592c4b99b3e6fec99105c8)
  fix #2589: avoid invoking getter as side-effect (#2592) (Carl-Erik Kopseng)
- [`9972e1e3`](https://github.com/sinonjs/sinon/commit/9972e1e3997198ff7f403ca5c000187f890f1699)
  Fix typo in mocks documentation (#2591) (Eduardo de la Cruz Palacios)
- [`52e6e4c5`](https://github.com/sinonjs/sinon/commit/52e6e4c540d8d0b95727c9bbde8328f6692a6675)
  chore: prefer cache option of setup-node (Morgan Roderick)
- [`08da1235`](https://github.com/sinonjs/sinon/commit/08da123555dc4ee4866720c925215dca4d3c799b)
  Bump actions/cache from 3 to 4 (dependabot[bot])
- [`404ef47e`](https://github.com/sinonjs/sinon/commit/404ef47e1119c7b8229e9d6a3c6ae9a912305d1f)
  Bump nokogiri from 1.14.3 to 1.16.2 (dependabot[bot])
- [`fd79612c`](https://github.com/sinonjs/sinon/commit/fd79612c3324bf3264533baa7159bb1722dd9788)
  Update Bug_report.md (Carl-Erik Kopseng)
- [`1fbc812a`](https://github.com/sinonjs/sinon/commit/1fbc812a9f3351f55a06758bdc8b1a053135d826)
  Re-add about (Carl-Erik Kopseng)
- [`fc8f6c3e`](https://github.com/sinonjs/sinon/commit/fc8f6c3e111473fcb53b2338eb8654b256c06e01)
  Fix formatting :clown: (Carl-Erik Kopseng)
- [`c57e38ae`](https://github.com/sinonjs/sinon/commit/c57e38ae2ec6c466f83c4e38e85d3d324f72bb13)
  Remove old template (Carl-Erik Kopseng)
- [`754bf7a9`](https://github.com/sinonjs/sinon/commit/754bf7a98b54a01472677772c7a34859f483adeb)
  Update Bug_report.md (Carl-Erik Kopseng)
- [`87eed9d2`](https://github.com/sinonjs/sinon/commit/87eed9d255e9493b981494188abd12a9e1d95bf0)
  Fix some typos at code comments (#2581) (EliyahuMachluf)
- [`cbae6997`](https://github.com/sinonjs/sinon/commit/cbae69978c29d0420fa39d11496bb29b180361b0)
  Link to createStubInstance util.md docs in stubs.md (#2577) (Daniel Kaplan)
- [`adcf936d`](https://github.com/sinonjs/sinon/commit/adcf936de0e946e2b72a513436c0469319f3da79)
  Fix Mocha watch task by delegating to Node (#2573) (Carl-Erik Kopseng)
- [`30ad2372`](https://github.com/sinonjs/sinon/commit/30ad23729568d70f865a5e6d323109fd06c7913e)
  prettier:write (Carl-Erik Kopseng)
- [`45c4d6b9`](https://github.com/sinonjs/sinon/commit/45c4d6b9b80841947d6ebc4af5046a11b216d598)
  Remove outdated info from README (#2571) (Carl-Erik Kopseng)
- [`6c9f5c2a`](https://github.com/sinonjs/sinon/commit/6c9f5c2ade9befeadd6fd7d10232883c147a9f1d)
  Add a notice that the Fake Timers API doc is incomplete (#2570) (Carl-Erik Kopseng)
- [`93db3ef3`](https://github.com/sinonjs/sinon/commit/93db3ef3b0b49458954eb6e7ed765aa1ea34b21d)
  breaking: Remove sinon.defaultConfig and related modules (#2565) (Carl-Erik Kopseng)
  > - breaking: Remove sinon.defaultConfig and related modules
  >
  > default-config and get-config are leftovers from when Sinon
  >
  > shipped with sinon.test (now the independent NPM module
  >
  > 'sinon-test').

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2024-05-07._

## 17.0.1

- [`5fde5aeb`](https://github.com/sinonjs/sinon/commit/5fde5aebc74dec12bacd84d00a2f22906a7ebcc0)
  fix returns does not override call through (#2567) (Raz Luvaton)
- [`b5fc3671`](https://github.com/sinonjs/sinon/commit/b5fc3671fff2481ab9b66486242f2c2ceb8d08e5)
  Documentation for assertion options for the sandbox (#2564) (Carl-Erik Kopseng)
- [`f7d180cc`](https://github.com/sinonjs/sinon/commit/f7d180ccc15b8dce958c08a780d384044d39bb2b)
  fix: assertion log limit (#2485) (Spencer Goossens)
- [`4f538e3e`](https://github.com/sinonjs/sinon/commit/4f538e3e74580a44e9b0cfcfdec9ca5f76d16fad)
  Fix mochify breaking on node:assert (#2559) (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-11-01._

## 17.0.0

- [`11a8e3f2`](https://github.com/sinonjs/sinon/commit/11a8e3f24ccec981a280dbe63df316d1fbde4ddd)
  Remove Proxyquire as it did not handle newer syntax (Carl-Erik Kopseng)
- [`ec37d634`](https://github.com/sinonjs/sinon/commit/ec37d6346fd51dd9b9ccf95d41c3339a0c88f539)
  Drop Node 16, as it is out of maintenance (Carl-Erik Kopseng)
- [`75e2b691`](https://github.com/sinonjs/sinon/commit/75e2b6910ca40ee5f3a39295ec654e124a6a325b)
  Upgrade fake-timers@11.2.2: new Intl mirroring and bugfixes (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-10-20._

## 16.1.3

- [`93e8aa93`](https://github.com/sinonjs/sinon/commit/93e8aa93c56c2d9d1ff783263adbd93de2603803)
  Remove postinstall script as it causes issues for consumers (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-10-19._

## 16.1.0

- [`cac5184b`](https://github.com/sinonjs/sinon/commit/cac5184b2a5c395e7e8775192ebcab234b6c180f)
  Enable use of assignment in the presence of accessors (#2538) (Carl-Erik Kopseng)
- [`f8c20e54`](https://github.com/sinonjs/sinon/commit/f8c20e5414464cf36a1dd48845ff57bf4e87d158)
  New article: making Sinon work with complex setups (#2540) (Carl-Erik Kopseng)
  > Co-authored-by: Morgan Roderick <morgan@roderick.dk> >
- [`cb5b9621`](https://github.com/sinonjs/sinon/commit/cb5b96214891dcff0890f07d01fe6b7d1627e8cb)
  Add NPM script 'dev-docs' and document its usage (Carl-Erik Kopseng)
- [`dd7c6091`](https://github.com/sinonjs/sinon/commit/dd7c6091f415f1f0129cb9673f79ad3e44eecd21)
  Add a little update to contributing (Carl-Erik Kopseng)
- [`79acdf38`](https://github.com/sinonjs/sinon/commit/79acdf380af52a34847a4861e637f5738c4b39eb)
  Move tool versions into single file at root (Carl-Erik Kopseng)
- [`03b1db50`](https://github.com/sinonjs/sinon/commit/03b1db50a1114b0e7ee5a26b0c813eda3fc54e07)
  Expose Changelog page (#2550) (Carl-Erik Kopseng)
- [`e1c3dad2`](https://github.com/sinonjs/sinon/commit/e1c3dad21d3d7c18f23f014bd952b5e4136687cb)
  Add section on tooling and recommend using ASDF for tool versioning (#2547) (Carl-Erik Kopseng)
  _Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-10-05._

## 16.0.0

- [`c3396058`](https://github.com/sinonjs/sinon/commit/c339605834f6fd7ba3afdd179fff3a8544e62bd7)
  fix(2525): ensure non empty message when error of type string is passed, but no message (#2544) (Mark de Dios)
- [`baa1aee9`](https://github.com/sinonjs/sinon/commit/baa1aee9e5766ff1bfcbc62d81ddaf3138174c54)
  .define method (#2539) (Konstantin Gukov)
  > - .define method for temporarily defining new properties during the tests
- [`fe799e78`](https://github.com/sinonjs/sinon/commit/fe799e78967cafcdfa29ef1d7cd00c420704b926)
  Fix issue 2534: spies are not restored (#2535) (Carl-Erik Kopseng)
- [`305fb6cc`](https://github.com/sinonjs/sinon/commit/305fb6ccb823a4a6059d8440d93c8032bef2afeb)
  fix: actaully reset 'injectedKeys' (#2456) (Morgan Roderick)
- [`de2635dd`](https://github.com/sinonjs/sinon/commit/de2635dd4293f21bd1e5a8b3e14d14d4f6e1f1da)
  Bump LTS version one notch: 20 (#2529) (Carl-Erik Kopseng)

_Released by Morgan Roderick on 2023-09-13._

## 15.2.0

- [`66b0081e`](https://github.com/sinonjs/sinon/commit/66b0081e1f9673b14277882faa10aaa1e3b564ff)
  Use fake-timers v10.1.0 re-released as v10.3.0 (Carl-Erik Kopseng)
  > Version 10.2.0 of fake-timers had an unexpected breaking
  > change. We re-released 10.1.0 as 10.3.0 to force users
  > into jumping over the deprecated version.
  >
  > v10.2.0 was re-released as v11.0.0 and will be part of
  > the next Sinon major
- [`a79ccaeb`](https://github.com/sinonjs/sinon/commit/a79ccaeb20bbb558902ae77b20bd026719de3004)
  Support callable instances (#2517) (bojavou)
  > - Support callable instances
  > - Clean prettier lint
  >
  > ***
  >
  > Co-authored-by: - <->
- [`d220c995`](https://github.com/sinonjs/sinon/commit/d220c99516ddb644d3702b4736bdfd311a2b05ec)
  fix: bundling compatibility with webpack@5 (#2519) (Avi Vahl)
  > - fix: bundling compatibility with webpack@5
  >
  > when using webpack v5 to bundle code that calls `require('sinon')` (cjs) , it would have defaulted to "exports->require" and fail with multiple node-api requirements (util, timers, etc.)
  >
  > this patch ensures that anyone who bundles sinon for browser gets the (browser-compatible) esm version.
  >
  > tested on both webpack v5 and v4. should be noted that v4 worked even without this patch, as it automatically injected polyfills. v5 no longer does so. with this PR, people using webpack@4 to bundle sinon at least see size improvement, as the polyfills are no longer required.
  >
  > - fix: revert change for package.json -> "browser"
  >
  > browserify doesn't seem to like esm. leave that entry point alone, and ensure "exports" -> "browser" (which webpack@5 uses) is esm.

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-06-20._

## 15.1.2

- [`02b73aed`](https://github.com/sinonjs/sinon/commit/02b73aed2d3d7dee071767fdf79073aa1dd673b6)
  Update lock file after removing node_modules ... (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-06-12._

## 15.1.1

- [`194fc2ef`](https://github.com/sinonjs/sinon/commit/194fc2ef726aba1cfd5753316414934d2551e18c)
  Change fake-timers version to specifically target the one containing the 'jump' feature (Carl-Erik Kopseng)
  > Instead of the later (breaking) version. See [#470](https://github.com/sinonjs/fake-timers/issues/470)
- [`05f05ac3`](https://github.com/sinonjs/sinon/commit/05f05ac30b1cb95c57dde3e30a4952679afb309a)
  docs: Remove threw(obj) from docs (#2513) (Morgan Roderick)
  > Since the introduction of threw in
  >
  > 0feec9ffba0da6bc2996cefa0c6e71872e8bedb2, no one have reported that
  >
  > `threw(obj)` doesn't work as the documentation states.
  >
  > ```js
  > const sinon = require("sinon");
  >
  > const o = { pie: "apple" };
  >
  > const f = sinon.fake.throws(o);
  >
  > f();
  >
  > // this is supposed to return true
  >
  > f.threw(o);
  >
  > // => false
  > ```
  >
  > Since it has been 12+ years without an error report, it's safe to assume
  >
  > that no one uses the `threw` method in this way. Let's remove it from
  >
  > the documentation.

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-06-12._

## 15.1.0

- [`79e719f2`](https://github.com/sinonjs/sinon/commit/79e719f21ecafd13130f0801231b5dd96ea0fb07)
  Ensure we use a fake-timers version with clock.jump (Carl-Erik Kopseng)
- [`b2a4df5a`](https://github.com/sinonjs/sinon/commit/b2a4df5a841bfce85b9beb0741a8d9afe86ab492)
  Add docs for clock.jump method (#2512) (Jason O'Neill)
- [`f096abff`](https://github.com/sinonjs/sinon/commit/f096abffa6add8ea29a99822c3b4d2710014d453)
  fix (#2514): only force new or inherited descriptors to be configurable (#2515) (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-05-18._

## 15.0.4

- [`e9042c4f`](https://github.com/sinonjs/sinon/commit/e9042c4f18f4aa3e36e13652196c746b759aa1a5)
  Handling non-configurable object descriptors on the prototype (#2508) (Carl-Erik Kopseng)
  > This should essentially make decorated methods stubbable again (see #2491)
- [`430c9a60`](https://github.com/sinonjs/sinon/commit/430c9a604f5509ca6d7e11e3edaaa8553a77ae93)
  Remove uses of `var` (#2506) (Carl-Erik Kopseng)
  > Replace var with const where possible in /lib and /test.
  >
  > Modified the let codemod to be a codemod.
  >
  > Took about half an hour with --watch running

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-04-20._

## 15.0.3

- [`b775f1b4`](https://github.com/sinonjs/sinon/commit/b775f1b4174c5a92fa7fa8f70fbf3f4b5466a39e)
  Avoid tampering with globals and other modules' exports in tests (#2504) (Carl-Erik Kopseng)
- [`477064b6`](https://github.com/sinonjs/sinon/commit/477064b628c65220ce9d0ac16cd33ab9b1da93da)
  fix: make it possible to call through to underlying stub in stub instance (#2503) (Carl-Erik Kopseng)
  > closes #2501
- [`6e19746e`](https://github.com/sinonjs/sinon/commit/6e19746e255dfa0fcf78af076e49d5db0eb11c07)
  Remove dead Travis and Gitter references (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-03-26._

## 15.0.2

- [`19bd99f3`](https://github.com/sinonjs/sinon/commit/19bd99f364ab44f0e2715571e5deab580d9aa7fd)
  Use no-op for every function when restoring instances (#2499) (Carl-Erik Kopseng)
- [`8663ffa0`](https://github.com/sinonjs/sinon/commit/8663ffa056d3c58e82fa203801d58d3fce3c14a7)
  Upgrade deps (#2498) (Carl-Erik Kopseng)
  > Browserify, supports-color, husky had to be held back.
- [`e01275bb`](https://github.com/sinonjs/sinon/commit/e01275bb10d868a064d0cb27a6ae11ffa3d91ac2)
  Un-pin @sinonjs/fake-timers (#2495) (Jordan Hawker)
  > The commit upgrading from v9 to v10 appears to have accidentally dropped the caret from the version range
- [`6cbde9b0`](https://github.com/sinonjs/sinon/commit/6cbde9b08259efd98b2c52b81ca3b5e84dcf97b1)
  fix throws().callsFake() precedence (#2497) (Eduardo Diaz)
  > This makes sure an unconditional `callsFake()` invoked on the same stub that was previously setup to throw will overwrite the previous behavior. This aligns it with the other behaviors.
- [`45be60f3`](https://github.com/sinonjs/sinon/commit/45be60f3c6afc350eacbceed77539f437a9bbbce)
  Replace probot/stale with official stale action (Morgan Roderick)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-03-12._

## 15.0.1

- [`aa493da4`](https://github.com/sinonjs/sinon/commit/aa493da47d788025c0d512696651072973f301ec)
  Upgrade to fake-timers v10.0.2 (Carl-Erik Kopseng)
  > Contains several fixes
- [`b3ee0aa5`](https://github.com/sinonjs/sinon/commit/b3ee0aa5c84e7c0f5203591e1507bd1015208925)
  Use Node version 18 in Runkit examples (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2022-12-15._

## 15.0.0

- [`b75fbfa9`](https://github.com/sinonjs/sinon/commit/b75fbfa9e57ba9b9c1b639b68646b1d054e0a7e3)
  Fix 2448: remove custom formatter (Morgan Roderick)
  > Remove option to pass a custom formatter.
  >
  > The sub libraries of Sinon has long moved on to use `util.inspect` from
  > Node. By using that in Sinon itself, we align all the libraries.

_Released by Morgan Roderick on 2022-11-28._

## 14.0.2

- [`4d70f6e0`](https://github.com/sinonjs/sinon/commit/4d70f6e0965b82e387cd632fbe54ed58a8fcf601)
  Upgrade nise to latest (Morgan Roderick)
- [`96a0d756`](https://github.com/sinonjs/sinon/commit/96a0d756b553c38154f442785c34c6092d1ac572)
  Update @sinonjs/samsam to latest (Morgan Roderick)
- [`babb4736`](https://github.com/sinonjs/sinon/commit/babb4736d7f0080e25dce34fc8ce72879e86792e)
  Prefer @sinonjs/commons@2 (Morgan Roderick)
  > That makes ES2017 support explicit

_Released by Morgan Roderick on 2022-11-07._

## 14.0.1

- [`6c4753ef`](https://github.com/sinonjs/sinon/commit/6c4753ef243880f5cdf1ea9c88b569780f9dc013)
  Fixed CSS selectors in `_base.scss` and changed blockquote default size to 16px. (Jose Lupianez)
- A bunch of dependency updates

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2022-10-03._

## 14.0.0

- [`c2bbd826`](https://github.com/sinonjs/sinon/commit/c2bbd82641444eb5b32822489ae40f185afbbf00)
  Drop node 12 (Morgan Roderick)
  > And embrace Node 18
  >
  > See https://nodejs.org/en/about/releases/

_Released by Morgan Roderick on 2022-05-07._

## 13.0.2

- [`bddb631a`](https://github.com/sinonjs/sinon/commit/bddb631aab6afc3e663a5db847c675ea96c90970)
  Update fake-timers (Carl-Erik Kopseng)
- [`eaed0eb2`](https://github.com/sinonjs/sinon/commit/eaed0eb24bd8f42b0484b8861a5ff066001da5d5)
  Bump nokogiri from 1.13.3 to 1.13.4 (#2451) (dependabot[bot])

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2022-04-14._

## 13.0.1

- [`ec4223f9`](https://github.com/sinonjs/sinon/commit/ec4223f94076d809483e3c6a7536cfc1278dd3c9)
  Bump nise to fix sinonjs/nise#193 (Carl-Erik Kopseng)
- [`f329a010`](https://github.com/sinonjs/sinon/commit/f329a01040bfa5a79e039419220b21eda56935d6)
  Add unimported to workflow (#2441) (Morgan Roderick)
- [`7f16cec9`](https://github.com/sinonjs/sinon/commit/7f16cec968c3c8d4e580267fb00195916d6f827d)
  Enable updates to same major version (Carl-Erik Kopseng)
- [`f784d7ad`](https://github.com/sinonjs/sinon/commit/f784d7ad2c86be0fc65477d69f8bdafca846ef2c)
  Re-introduce new version.sh script to version hook (Joel Bradshaw)
  > This was inadvertently removed during merge conflicts, and is required
  > for any of the new release process stuff to work
- [`51c508ab`](https://github.com/sinonjs/sinon/commit/51c508ab77cf0f9fb8c5305ff626f6a2eada178f)
  Add dry run mode to `npm version` (#2436) (Joel Bradshaw)
  > - Add DRY_RUN flag to skip publish/push
  > - Allow overriding branch names for testing
- [`05341dcf`](https://github.com/sinonjs/sinon/commit/05341dcf92ddca4a1d4c90966b1fcdc7039cff18)
  Update npm version scripts to manage new releases branch (Joel Bradshaw)
- [`fe658261`](https://github.com/sinonjs/sinon/commit/fe65826171db69ed2986a1060db77944dbc98a6d)
  Remove release archives from master (Joel Bradshaw)
  > These archives made it difficult to find things in the GitHub interface,
  > and take up a lot of space in a checked-out repo for something that is
  > not useful to most people checking out the repository.
  >
  > The main purpose of these archives is to make old versions and
  > documentation available on the Sinon website that is run out of this
  > repo. This can be supported by using a separate branch for website
  > releases, and to maintain the archives.
  >
  > Following this commit, the `npm version` scripts will be updated to
  > automatically handle archiving the releases in the new releases branch
  > and keeping it up to date with master.
  >
  > Also remove the directories we removed from .prettierignore, since they
  > don't exist any more.

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2022-02-01._

## 13.0.0

- [`cf3d6c0c`](https://github.com/sinonjs/sinon/commit/cf3d6c0cd9689c0ee673b3daa8bf9abd70304392)
  Upgrade packages (#2431) (Carl-Erik Kopseng)
  > - Update all @sinonjs/ packages
  > - Upgrade to fake-timers 9
  > - chore: ensure always using latest LTS release
- [`41710467`](https://github.com/sinonjs/sinon/commit/417104670d575e96a1b645ea40ce763afa76fb1b)
  Adjust deploy scripts to archive old releases in a separate branch, move existing releases out of master (#2426) (Joel Bradshaw)
  > Co-authored-by: Carl-Erik Kopseng <carlerik@gmail.com>
- [`c80a7266`](https://github.com/sinonjs/sinon/commit/c80a72660e89d88b08275eff1028ecb9e26fd8e9)
  Bump node-fetch from 2.6.1 to 2.6.7 (#2430) (dependabot[bot])
  > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a00f14a9`](https://github.com/sinonjs/sinon/commit/a00f14a97dbe8c65afa89674e16ad73fc7d2fdc0)
  Add explicit export for `./*` (#2413) (なつき)
- [`b82ca7ad`](https://github.com/sinonjs/sinon/commit/b82ca7ad9b1add59007771f65a18ee34415de8ca)
  Bump cached-path-relative from 1.0.2 to 1.1.0 (#2428) (dependabot[bot])
- [`a9ea1427`](https://github.com/sinonjs/sinon/commit/a9ea142716c094ef3c432ecc4089f8207b8dd8b6)
  Add documentation for assert.calledOnceWithMatch (#2424) (Mathias Schreck)
- [`1d5ab86b`](https://github.com/sinonjs/sinon/commit/1d5ab86ba60e50dd69593ffed2bffd4b8faa0d38)
  Be more general in stripping off stack frames to fix Firefox tests (#2425) (Joel Bradshaw)
- [`56b06129`](https://github.com/sinonjs/sinon/commit/56b06129e223eae690265c37b1113067e2b31bdc)
  Check call count type (#2410) (Joel Bradshaw)
- [`7863e2df`](https://github.com/sinonjs/sinon/commit/7863e2dfdbda79e0a32e42af09e6539fc2f2b80f)
  Fix #2414: make Sinon available on homepage (Carl-Erik Kopseng)
- [`fabaabdd`](https://github.com/sinonjs/sinon/commit/fabaabdda82f39a7f5b75b55bd56cf77b1cd4a8f)
  Bump nokogiri from 1.11.4 to 1.13.1 (#2423) (dependabot[bot])
- [`dbc0fbd2`](https://github.com/sinonjs/sinon/commit/dbc0fbd263c8419fa47f9c3b20cf47890a242d21)
  Bump shelljs from 0.8.4 to 0.8.5 (#2422) (dependabot[bot])
- [`fb8b3d72`](https://github.com/sinonjs/sinon/commit/fb8b3d72a85dc8fb0547f859baf3f03a22a039f7)
  Run Prettier (Carl-Erik Kopseng)
- [`12a45939`](https://github.com/sinonjs/sinon/commit/12a45939e9b047b6d3663fe55f2eb383ec63c4e1)
  Fix 2377: Throw error when trying to stub non-configurable or non-writable properties (#2417) (Stuart Dotson)
  > Fixes issue #2377 by throwing an error when trying to stub non-configurable or non-writable properties

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2022-01-28._

## 12.0.1

- [`3f598221`](https://github.com/sinonjs/sinon/commit/3f598221045904681f2b3b3ba1df617ed5e230e3)
  Fix issue with npm unlink for npm version > 6 (Carl-Erik Kopseng)
- [`51417a38`](https://github.com/sinonjs/sinon/commit/51417a38111eeeb7cd14338bfb762cc2df487e1b)
  Fix bundling of cjs module (#2412) (Julian Grinblat)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2021-11-04._

## 12.0.0

- [`b20ef9e4`](https://github.com/sinonjs/sinon/commit/b20ef9e4940e9384a6d0707b917a38e7bbfcd816)
  Upgrade to fake-timers@8 (Carl-Erik Kopseng). This is potentially breaking, but should not be,
  as the breaking change deals with the Node timer object created by fake timers.
- [`eba42cc3`](https://github.com/sinonjs/sinon/commit/eba42cc38dbaf5417178a12cec11e35014e335ea)
  Enable esm named exports (#2382) (Julian Grinblat)
- [`b0cf5448`](https://github.com/sinonjs/sinon/commit/b0cf5448993c2ace607cdf430b7e389d02c2f296)
  Spelling (#2398) (Josh Soref)
- [`e78a6706`](https://github.com/sinonjs/sinon/commit/e78a670611682c7e35cf7d27887b409d6397d27c)
  Make calledWith() assertions idempotent (#2407) (Joel Bradshaw)
- [`2814c0a2`](https://github.com/sinonjs/sinon/commit/2814c0a212ab6b79c7251e4b0a1bebc9918257d4)
  Generate CHANGES.md using @studio/changes (Morgan Roderick)
  > This will bring us closer to having the same release process as the
  > other `@sinonjs` packages.
- [`2d5d6ad4`](https://github.com/sinonjs/sinon/commit/2d5d6ad4cd89c2063834991da5073f7640d0d722)
  Run tests in Node 16 in GitHub Actions (Morgan Roderick)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2021-11-03._

## 11.1.2

- Upgrade @sinonjs/fake-timers to latest, see https://github.com/sinonjs/fake-timers/blob/master/CHANGELOG.md#712--2021-05-28
- Copy over accessor properties to target object #2387

## 11.1.1

- Fix #2379 by using v7 of supports-color

## 11.1.0

- Add sinon.promise() implementation (#2369)
- Set wrappedMethod on getters/setters (#2378)
- [Docs] Update fake-server usage & descriptions (#2365)
- Fake docs improvement (#2360)
- Update nise to 5.1.0 (fixed #2318)

## 11.0.0

- Explicitly use samsam 6.0.2 with fix for #2345
- Update most packages (#2371)
- Update compatibility docs (#2366)
- Update packages (includes breaking fake-timers change, see #2352)
- Warn of potential memory leaks (#2357)
- Fix clock test errors

## 10.0.1

- Upgrade sinon components (bumps y18n to 4.0.1)
- Bump y18n from 4.0.0 to 4.0.1

## 10.0.0

- Upgrade nise to 4.1.0
- Use @sinonjs/eslint-config@4 => Adopts ES2017 => Drops support for IE 11, Legacy Edge and legacy Safari

## 9.2.4

- Upgrade @sinonjs/samsam@5.3.1

## 9.2.3

- Use `util.inspect` for formatting human readable output
  (this retires @sinonjs/formatio)

## 9.2.2

- Fix #2316: handle absent Promise (#2317)

## 9.2.1

- Fix #2203: skip writing 'name' property if not writable (#2304)
- Update error message on assert when representation of expected and actual value is equal, fixing issue #2084 (#2303)
- Make sandboxes each use their own assert object (#2302)
- Add usingPromise() method on fakes to fix issue #2293 (#2301)

## 9.2.0

- Update dependencies (#2299)
- Update sandbox docs with missing comma
- Add minor markdown formatting to release docs for sandbox
- Minor formatting improvements to legacy sandbox documentation

## 9.1.0

- Add a calledOnceWithMatch assertion (#2294)

## 9.0.3

- Upgrade nise to latest
- Upgrade @sinonjs/samsam to latest

## 9.0.2

- Bump @sinonjs/fake-timers (fix error when using Node's util/promisify with setTimeout)
- Upgrade @sinonjs/commons (fix error when trying to calculate function name from generators)

## 9.0.1

- Fix #2226: restore props defined on prototype chain by deleting

## 9.0.0

- Ignore errors on thisValue property accesses (#2216)
- Add firstArg to spy calls and fakes. (#2150)
- Drop Node 8 support

## 8.1.1

- Fundraiser for better docs: https://www.gofundme.com/f/sinon-docs

## 8.1.0

- Support negative indices in getCall (#2199)

## 8.0.4

- Remove misleading 'own' from exception message

## 8.0.3

- Move .printf to proxy

## 8.0.2

- Upgrade @sinonjs/samsam to latest
- Upgrade nise to 3.0.1

## 8.0.1

- Force upgrade @sinonjs/commons (#2181)
- Update `docs/changelog.md` and set new release id in `docs/_config.yml`
- Add release documentation for v8.0.0

## 8.0.0

The major release is caused by removing old mistakes and upgrading dependencies that themselves have had new major releases.

- Upgrade nise, @sinonjs/formatio, @sinonjs/samsam and @sinonjs/referee
- Update lolex and nise to get new async timer methods (see https://github.com/sinonjs/lolex/blob/master/CHANGELOG.md)
- Remove `sinon.spyCall`
- Remove `sinon.sandbox.create`
- Remove obsolete `deprecated.printWarning` stubbing from test

## 7.5.0

- Add sinon.assert.calledOnceWithExactly
- Feature parity: support _spying_ all methods on an object

## 7.4.2

- Restore sinon.createStubInstance() behaviour (#2073)
- Fix Typo in migration 6 and updated migration docs for migration from… (#2074)

## 7.4.1

- Update nise and lolex (minor versions)
- add callThroughWithNew method
- add browser field
- Create COMPATIBILITY.md (#2051)
- Fix sinon.resetHistory() does not reset history (#2022)

## 7.4.0

- Was unpublished (see #2071)

## 7.3.2

- Update Lolex to bring in fix for sinonjs/lolex#232 (queueMicrotask warning)

## 7.3.1

- Fix security issues
- Update @sinonjs/samsam to v3.3.1

## 7.3.0

- Simplify Circle CI setup
- Add a Docker Compose config file for testing the setup locally
- Inject createStubInstance and fake functionality
- Remove unused prop 'injectIntoThis'
- Fix #1974 by upgrading to @sinonjs/samsam@3.3.0

## 7.2.7

- Retain spy function names and fix spy.named(name) (#1987)
- Document spying on accessors (#1976)

## 7.2.6

- Upgrade @sinonjs/formatio
- Set `fake.lastArg` to last argument regardless of type

## 7.2.5

- don't call extends.nonEnum in spy.resetHistory (#1984)

## 7.2.4

- minor package updates
- Update eslint-plugin-mocha
- Fix high prio audit warnings
- Update nise to use @sinonjs/text-encoding
- Make all properties non-enumerable in spies, stubs, mocks and fakes
- docs(sandbox): add example for default sandbox

## 7.2.3

- Update @sinonjs/nise
- Fix stubbing function objects (#1968)

## 7.2.2

- Fix mock.withArgs using matchers (#1961)

## 7.2.1

- #1957: check for truthiness before checking whether optional override is a stub
- Upgrade @sinonjs/samsam
- Upgrade @sinonjs/referee to v3

## 7.2.0

- Upgrade to samsam 3 (#1955)
- Rename History.md to CHANGELOG.md

## 7.1.1

- Make the spy functions non enumerable so that printing it is more concise (#1936)

## 7.1.0

- Issue #1852: Add a way to pass a global context to lolex when calling useFakeTimers
- Get latest 'nise' patch

## 7.0.0

- Update to Lolex 3: no negative ticks allowed

## 6.3.5

- Upgrade lolex
- Upgrade @sinonjs/samsam - fixes minor issue with IE11 introduced in 6.3.4

## 6.3.4

- Update samsam, puppeteer and rollup
- Fix #1850 (keep context in fakes)

## 6.3.3

- Upgrade formatio, samsam, nise and referee

## 6.3.2

- Adds guard for empty properties in deepEqual when a matcher is provided (#1901)

## 6.3.1

- Fix use of non-cached reference to forEach

## 6.3.0

- Allow providing stubs overrides for sinon.createStubInstance (#1864)
- Bump Lolex to 2.7.4 to include IE fixes for performance.mark

## 6.2.0

- Add mock.usingPromise to set the Promise library for mock expectations

## 6.1.6

- Upgrade Lolex, Nise and other dependencies

## 6.1.5

- Fix #1796, failing to stub Array.prototype.sort

## 6.1.4

- Update lolex and nise dependencies to latest versions

## 6.1.3

- Fix issue with matchers and cyclic references (#1709)

## 6.1.2

- Made callsArg, returnsArg, and throwsArg more strict (#1848)

## 6.1.1

- Restore useFakeXMLHttpRequest correctly in default sandbox (#1840)

## 6.1.0

- Syntax sugar for resolvesArg (#1846)

## 6.0.1

- Add fake behaviors to sandbox (#1815)

## 6.0.0

- Export Sinon and its functions as an EcmaScript module (#1809 and #1835)
- Document/test call ordering checks

## 5.1.1

- Remove ES2015 'module' field for 5x branch (fix in separate branch - see tag)

## 5.1.0

- Add `in` matcher (#1811)

5## .0.10

- Remove functions shadowing time related sandbox methods (#1802)

## 5.0.9

- Upgrade `@std/esm` to `esm`.

## 5.0.8

- Add isSealed check to is-es-module to make certain ESM mocks possible

## 5.0.7

- Fix stub id prefix (#1786)

## 5.0.6

- Remove support-sinon.js as postinstall banner

## 5.0.5

- Refuse to replace already replaced values (#1779)

## 5.0.4

- Fix #1781: Reject non-function values a f argument to fake

## 5.0.3

- Fix #1775: Default sandbox does not restore stubs, spies, mocks

## 5.0.2

- Reset history on sandbox reset (#1770)

## 5.0.1

- Remove deprecated spy.reset method
- Add sinon.replace, sinon.replaceGetter and sinon.replaceSetter
- Add `fake`
- Use `sinon` as a default sandbox

## 4.5.0

- Add .lastArg and .callback to spy call

## 4.4.9

- Fix #1746: Remove dependency on ES2015 code from post-install script

## 4.4.8

- Fix 1743: Add scripts/support-sinon.js to package

## 4.4.7

- Improve the post-install script: remove noise, add :heart:

## 4.4.6

- Return returned value of invokant when using yields* and callsArg* (#1724)

## 4.4.5

- Add postinstall banner pointing to Open Collective

## 4.4.4

- Make @std/esm a devDependency

## 4.4.3

- Fix inconsistent newline usage for %D in spy.printf (#1717)

## 4.4.2

- Add descriptive error message on attempt to call argument that is not a function (#1695)

## 4.4.1

- Docs: make it clear that it is possible to use assert with spy calls (#1688)

## 4.4.0

- Change return value of yield and callArg

## 4.3.0

- add calledOnceWithExactly assertion (#1247)

## 4.2.3

- Replace formatio with @sinonjs/formatio

## 4.2.2

- Fix #1638: Make resetHistory work for props

## 4.2.1

- Performance: spend less time stubbing methods (#1627)

## 4.2.0

- Add match.every and match.some (#1624) (#1661)

## 4.1.6

- Fix bad build, missing nise@1.2.0 (#1656)
- Upgrade dependency supports-color

## 4.1.5

- Use nise.fakeServer as the sandbox serverPrototype (#1534)

## 4.1.4

- Fix: assertion error messages did not handle Symbol names (#1640)
- Deprecate spy.reset(), use spy.resetHistory() instead (#1446)

## 4.1.3

- Spy passes through calling with `new` (#1626)

## 4.1.2

- Update Lolex to include fix for #872
- Remove deprecated methods from documentation (#1613)

## 4.1.1

- Remove "engines" from package.json

## 4.1.0

- Add sandbox.createStubInstance (#1598)

## 4.0.2

- Update 'nise' to latest version (#1593)
- Use supports-color module to test if system supports colors
- Upgrade mocha to v4.0.0
- Make samsam a development dependency
- Make native-promise-only a development dependency

## 4.0.1

- Upgrade nise and lolex versions (#1579)

## 4.0.0

- Explicitly update fake xhr lib 'nise'
- Remove accidental dependency to "build"
- Remove support for stubbing undefined props (#1557)

## 3.3.0

- Adds sinon.match.hasNested
- fix 'callThrough with a mock expectation' (#1442)
- Documentation updates
- Allow custom defined instance checks if supported

## 3.2.1

- resolvesThis should override previous throws
- preserve context of functions from nise: fakeServer, fakeServerWithClock
- Fix regression for issue #1526 regarding onFirstCall().throws()
- Fix docs regression introduced by #1523

## 3.2.0

- Fix #1521 by caching references to Array.prototype.filter (#1523)
- Fix #1368 by adding stub#resolvesThis (#1517)

## 3.1.0

- Lots of documentation updates
- Fix regression on sandbox.stub(obj,protoMethod)
- Add factory functions for sandbox and fake server
- Add support for passing a function to stub.throws(...). (#1511)

## 3.0.0

- Remove deprecated exports (see migration guide)
- Fix #1432: add details around expectations.withArgs behavior to docs (#1501)
- Fix #1487: incorrect withArgs().returnValue
- add format.setFormatter
- Upgrade lolex to 2.1.2
- Extract fakeXhr, fakeServer and fakeServerWithClock into own module `nise` and re-import it to keep api the same

## 2.4.1

- stub#withArgs: set promiseLibrary correctly (#1497)

## 2.4.0

- Allow anonymous mock functions to be named

## 2.3.8

- Fix 1474: propagates promiseLibrary to new stub behaviors (#1484)

## 2.3.7

- Fix #1476: spy.withArgs(args...).firstCall is broken

## 2.3.6

- Fix #1274: spy.withArgs(args...).callCount is incorrect

## 2.3.5

- Check configurable on a prop before creating (fixes #1456) (#1462)

## 2.3.4

- Fix #1372: make sandbox.resetHistory also reset spies (#1424)

## 2.3.3

- Fix #1445: make stubbing of static function properties possible

## 2.3.2

- Fix failing sandbox.resetBehavior() (#1428)
- Fix restoring getters/setters/values for previously unexisting props (#1419)
- Called in order takes callCount into account. Closes #1398.

## 2.3.1

- Make calledAfter symmetric with calledBefore (#1407)

## 2.3.0

- Allow stubbing of accessors with and without sandbox (#1416)
- add throwsArg(index) to stubs (#1319)
- Fix: forEach() requires 'this' argument (#1356)
- Only reset history when calling resetHistory()

## 2.2.0

- Added `usingPromise` method to stub and sandbox.
- Added support for React Native window location format Fixes sinonjs/sinon#1362
- Fix error on call.toString() where stack has fewer than 4 lines.

## 2.1.0

- Redesign the template (#1339)
- [feature] adds spy.calledImmediatelyBefore and spy.calledImmediatelyAfter
- Fix issue #1332: little bug correction in spy.printf "%\*" formatter.

## 2.0.0

- Add restore method for stubbed property descriptors
- Allow stubbing getters and setters for function properties
- Add getters/setters stub behaviors
- Refactor xhr and xhr.upload to use the same EventTargetHandler
- Remove SSL part of base url

## v2.0.0-pre.6

- Add sinon.addBehavior, use it to add the default behaviors
- Use Node instead of Ruby in the build script
- Lots of documentation updates
- Many dependency updates
- Add a simple implementation og ANSI colors and boot out chalk
- No circular dependencies, thank you very much
- Replace homegrowns with ES5
- Remove legacy IE bits from code
- Fire onload event on non-2xx HTTP statuses in FakeXDomainRequest
- Extract throwOnFalsyObject to own function
- Stop polluting the test console with a "test" string
- Complete internalization of `extend` and `typeOf`
- Allow calling original function from stub. Closes #989 (#1234)
- Matcher for Set type
- Matcher for Map type
- Fix set iterableToString test on IE11
- add test-dev npm script to run tests in watch mode

## v2.0.0-pre.5

- 2.0.0-pre.5
- Update Changelog.txt and AUTHORS for new release
- Update changelog for pre.4
- Remove polyfill for Promise
- Remove old, unused, ci script for BusterJS
- Abort pre-commit script when no files are changed
- Check for required arguments
- Make SED in-place update switch work on BSD
- Upgrade text-encoding to the latest version
- Improve rendering of sandbox.create(config) example
- Remove sinon.test from sandbox documentation
- Use baseurl to render links correctly on github pages
- Specify same version of github-pages as github
- Remove release_id from front matter
- Update Gemfile.lock to use latest supported Jekyll
- Fix #614: Add missing documentation for sandbox methods
- Add missing documentation for stubs
- Fix #1026: stub watch method on object
- Fix invalid test for "does not walk the same property twice"
- Add test for issue #1026
- Fix 810 - Added documentation for sinon.restore()
- Add docs for new array matchers
- Array contains matcher fails when actual is not an array
- Array endsWith matcher fails when actual is not an array
- Array startsWith matcher fails when actual is not an array
- Array deepEquals matcher fails when actual is not an array
- Add .resolves and .rejects to stub (#1211)
- Accept routing DSLs on fake server
- Convert remaining calledWith methods to use diff color formatting
- Color diffs for sinon matchers
- Print diffs for multiple spy calls
- Add new spy output formatter for handling diffs
- Add contains array matcher
- Add endsWith array matcher
- Add startsWith array matcher
- Add deepEquals array matcher
- Add more array matchers
- Extract deprecated.printWarning
- Move empty stub creation to avoid unnecessary stub.create
- Fix typo on property name called 'matchingAguments'
- Soften migration path with deprecation warning
- Update docs and migration guide
- Convert 3 arg stub to callsFake
- Update format docs to refer to formatio
- Fix being able to spy Error
- Prepare documentation using site in GitHub Pages
- Add link to LICENSE in README.md
- Add documentation for accessor method support for stubs and spies
- Previous expectation failures are checked and re-thrown again in mock.verify()
- Expose XHR.setStatus to simplify asynchronous answers
- Fix typo
- Add a how-to article about using links seams for CommonJS modules
- stub() will fail if passed an empty property descriptor
- Rename func argument to funcOrDescriptor
- Add documentation for sinon.assert.match
- XHR: test for readystatechange not dispatching after .abort() in DONE state
- XHR: fix readystatechange event after .abort() in DONE state
- Add tests for xhr.readyState after abort()
- Test that demonstrates that a mock can be called more times than expected without failing (if the exception is silenced).

## v2.0.0-pre.6

- Merge pull request #1303 from dougo/docs-fixups
  Docs fixups
- Merge pull request #1302 from sinonjs/add-behavior
  addBehavior
- Merge pull request #1300 from Gvozd/optimize_performance
  Optimize performance of call-stack getting
- Merge pull request #1301 from fatso83/1299-redirect-traffic-to-releases
  Redirect /docs and /downloads to /releases
- Merge pull request #1296 from sinonjs/remove-deal-links
  Remove dead links
- Merge pull request #1295 from mroderick/add-bithound-config
  Add .bithoundrc
- Merge branch 'bouk-server-aint-xhr'

- Merge pull request #1293 from mroderick/update-v1-docs-with-bundler-warnings
  Update 1.x documentation to say that it doesn't work with
  bundlers
- Merge pull request #1294 from sinonjs/browserify-build
  Use Node instead of Ruby in the build script
- Merge pull request #1292 from mroderick/update-readme
  Update readme
- Merge pull request #1291 from mroderick/update-phantomjs
  Use phantomjs-prebuilt
- Merge pull request #1289 from mroderick/fix-invalid-release-version-in-docs
  Fix invalid release number in v1.17.7.md front matter
- Merge pull request #1290 from sinonjs/common-eslint
  Use common Sinon.JS eslint config
- Merge pull request #1288 from mroderick/improve-documentation
  Improve documentation
- Merge pull request #1283 from lucasfcosta/docs-stub-callThrough
  Add docs for stub.callThrough()
- Merge pull request #1285 from sinonjs/uncycle-server-deps
  Uncycle server deps
- Merge pull request #1282 from sinonjs/mochify-3
  Use mocaccino 2 and mochify 3
- Merge pull request #1281 from mroderick/add-missing-documentation
  Add missing documentation
- Merge pull request #1277 from mroderick/remove-copyright-comments
  Remove copyright comments
- Merge pull request #1271 from mroderick/use-es5-features
  Refactoring: use ES5.1 features
- Merge pull request #1273 from melinath/patch-1
  Update text-encoding version
- Merge pull request #1255 from fatso83/remove-legacy-ie
  Remove traces of legacy IE
- Merge pull request #1266 from duclet/chalk
  Switch to using "chalk" from "colors"
- Merge pull request #1260 from JoshuaCWebDeveloper/ajax_events
  Fire onload event on non-2xx HTTP statuses in
  FakeXDomainRequest - fixes #1259
- Merge pull request #1257 from piamancini/patch-1
  Add backers and sponsors from Open Collective
- Merge pull request #1256 from sprzybylski/download-page
  Create downloads page (#1218)
- Merge pull request #1252 from mroderick/update-bundle-for-ruby-2.4.0
  Update Gemfile for ruby 2.4.0
- Merge pull request #1254 from mroderick/refute-issue-1245-in-sinon-2
  Add test to disprove issue 1245 in Sinon 2.x
- Merge pull request #1253 from BenBrostoff/error-equality
  Add error equality to deepEqual
- Merge pull request #1243 from sprzybylski/changelog-page
  Update changelog page in postversion.sh
- Merge pull request #1239 from mroderick/refactor-stub-method
  Refactor stub methods
- Merge pull request #1242 from Floby/add-documentation-for-promise-stub
  Add documentation for .rejects() and .resolves()
- Merge pull request #1241 from mroderick/cleanup-test-console
  Stop polluting the test console with a "test" string
- Merge pull request #1238 from tarjei/patch-1
  Document server.requests
- Merge pull request #1235 from jonnyreeves/feature/internalize
  Internalise `typeOf` and `extends`
- Merge pull request #1233 from lucasfcosta/fix-deepEqual-for-matchers
  Ensures different matchers won't be called against each
  other. Closes…
- Merge pull request #1232 from lucasfcosta/sets-matchers
  Sets matchers
- Merge pull request #1227 from zuzusik/zuzusik-always_chain_behavior_with_stub
  Always chain behavior with stub
- Merge pull request #1215 from lucasfcosta/maps-matchers
  Maps matchers
- Merge pull request #1226 from lucasfcosta/improve-site-readability
  Improve site readability
- Merge pull request #1225 from lucasfcosta/resolve-reject-promise-upon-invoke
  Resolve/reject promise only upon invoke

## v2.0.0-pre.5

- Merge pull request #1223 from fatso83/release-script-improvements
  Minor fixes to the release scripts
- Merge pull request #1222 from Gothdo/patch-1
  Upgrade text-encoding to the latest version
- Merge pull request #1216 from mroderick/improve-documentation
  Improve documentation for stubs and sandboxes
- Merge pull request #1217 from mroderick/make-docs-run-on-github-pages
  Update Gemfile.lock to use latest supported Jekyll
- Merge pull request #1213 from tiemevanveen/docs-restore
  Added documentation for sinon.restore()
- Merge pull request #1214 from mroderick/fix-1026-in-2.x
  Fix 1026 in 2.x
- Merge pull request #1210 from lucasfcosta/document-new-array-matchers
  Add docs for new array matchers
- Merge pull request #1203 from jdgreenberger/add-expectation-diff-logs
  Add expectation diff logs
- Merge pull request #1208 from lucasfcosta/array-matchers
  Array matchers
- Merge pull request #1209 from lucasfcosta/avoid-unnecessary-empty-stub-creation
  Avoid unnecessary empty stub creation
- Merge pull request #1207 from hurrymaplelad/calls-fake
  Replace `stub(o, 'm', fn)` with `stub(o, 'm').callsFake(fn)`
- Merge pull request #1162 from dottedmag/master
  XHR spec conformance: abort() should not dispatch
  readystatechange event in DONE state
- Merge pull request #1184 from mroderick/fail-on-empty-property-descriptor
  Fail on empty property descriptor
- Merge pull request #1206 from fatso83/sinon-format-docs
  Update format docs to refer to formatio
- Merge pull request #1204 from estobbart/master
  Fix being able to spy Error
- Merge pull request #1189 from mroderick/docs-in-github-pages
  Prepare documentation using site in GitHub Pages
- Merge pull request #1180 from mroderick/add-documentation-for-assert.match
  Add documentation for sinon.assert.match
- Merge pull request #1182 from mroderick/document-accessor-support
  Add documentation for accessor method support for stubs and
  spies
- Merge pull request #1191 from LostArchives/master
  Add link to LICENSE in README.md
- Merge pull request #1188 from DanReyLop/verify-silenced-exceptions
  Mock expectation errors are now re-thrown when calling
  mock.verify()
- Merge pull request #1186 from mroderick/add-how-to-link-seam-commonjs
  Add a how-to article about using links seams for CommonJS
  modules
- Merge pull request #1178 from dottedmag/feature-xhr-set-status
  Expose XHR.setStatus to simplify asynchronous answers

## 2.0.0-pre.5

- Upgrade text-encoding to the latest version
- Remove sinon.test from sandbox documentation
- Fix #1026: stub watch method on object
- Add .resolves and .rejects to stub (#1211)
- Accept routing DSLs on fake server
- Color diffs for sinon matchers
- Add new spy output formatter for handling diffs
- Add various array matchers
- Convert 3 arg stub to callsFake
- Fix being able to spy Error
- Prepare documentation using site in GitHub Pages
- Various documentation additions and fixes
- Previous expectation failures are checked and re-thrown again in mock.verify()
- Expose XHR.setStatus to simplify asynchronous answers
- XHR: test for readystatechange not dispatching after .abort() in DONE state
- XHR: fix readystatechange event after .abort() in DONE state

## 2.0.0-pre.4

- Use last matching withArgs declaration when using matchers (#1183)
- Implement XHR.overrideMimeType
- Fire .onprogress event handler in fake XHR
- Expose readyState constants on XHR instances
- add configurable unsafe header checks (#1061)

## 2.0.0-pre.3

- Add assertion check for too many args with calledOnce/Twice/Thrice
- Much internal refactoring relating to CommonJS

## 2.0.0-pre.2

- CJSify sinon.call tests (#1079)
- CJSify sinon.calledInOrder tests (#1080)
- CJSify get-config tests (#1081)
- CJSify sinon.assert tests (#1078)
- Resolve test failure in node 0.10.x (#1073)
- Expose `sinon.assert` on sandbox instances. (#1076)
- Add resetBehavior and resetHistory to sandbox API (#1072)
- Fix incorrect inline function names
- Fix calledOnce on tests for #283. This closes #283.
- Add sandbox.reset() docs
- Add a line recommending how to pronounce.
- Improve tests based on PR feedback
- Allow xhr.respond(0) to simulate a network failure and call onerror
- Use event loaded instead of error event for code like 403, 500, etc.
- Fix invalid markdown in fake-timers.ms (#1054)
- Do not invoke getters in walk (#1059)
- ReactNative compatibility. Allow sinon fakeServer to run in React Native (#1052)
- added timeouts to ensure tests pass
- Run tests on stable Node 6 instead of unstable Node 5
- added tests to ensure only expected events are fired (#1043)
- Fixed formatting of issue template
- Added note on using latest version
- Fix onerror event triggering for fake xhr requests (#1041)
- Add missing mocaccino and phantomic to package.json (#1029)
- Pull request and issue templates (#1012)
- Fix capturing of stack traces in Phantom.js.
- Allow sinon.calledInOrder to be called either with an array of spies or multiple spies as parameters. Add explicit test cases for sinon.calledInOrder
- Fix typos found by codespell
- Document faking of setImmediate and clearImmediate
- Add feature detection guard for tests containing es6 Symbols
- Add support for es6 Symbol to wrapMethod method
- Convert values to strings with toString instead of String()
- Add typeOf matcher for symbol type
- Make expectation fail as expected when called with wrong Symbol
- Make mock report expected TypeError when expecting number and given symbol
- Add support for es6 Symbol to match.has method
- Make error message when failing to stub method support es6 symbol
- Make yieldToOn fail as expected when yielding an es6 Symbol
- Add support for es6 Symbol to match.same method
- Make yieldTo fail as expected when yielding an es6 Symbol
- Add support for es6 Symbol to match method
- Work around SauceLabs security limitations
- Declare test specific eslint configs in test/.eslintrc
- Add test-coverage script
- Add eslint-plugin-mocha
- Remove browserify-shim
- Setup saucelabs tests and adjust travis config
- Feature detect **proto** to exclude a timer test in IE 10
- Convert webworker test to mocha
- Remove buster
- Replace npm test script with mocha / mochify invocations
- Fix async fake-xml-http-request tests
- Convert issues tests to mocha
- Convert util tests to mocha
- Convert core tests to mocha
- Convert stub tests to mocha
- Convert typeof tests to mocha
- Convert spy tests to mocha
- Convert sandbox tests to mocha
- Convert mock tests to mocha
- Convert hello world test to mocha
- Convert extend tests to mocha
- Convert collection tests to mocha
- Convert call tests to mocha
- Convert assert tests to mocha
- Convert matcher tests to mocha
- Update docs/TODO.md to reflect plan to Jekyll
- CJSify Spy and Stub Tests.
- CJSify Core Util Tests.
- Migrate Packaged Tests to use a Browserified Build.
- fix non enumerable methods stub restore
- Improve Blob support detection logics
- Fix a typo in Contributing.md
- Update Node versions on Travis
- Use PhantomJS 2.
- Fix #835: make err.message writable
- Remove linting errors in switch cases
- Add spy.notCalled to documentation
- Remove `sinon.test()` and `sinon.testCase`.
- Remove `sinon.log` and `sinon.logError`
- De-fluff
- Remove `sinon-test` module.
- Extract `get-config` tests from `sinon-test`.
- Extract `function-to-string` tests from `sinon-test`.
- Extract `restore` tests from `sinon-test`.
- Extract `createStubInstance` tests from `sinon-test`
- Extract `deep-equal` tests from `sinon-test`.
- Extract `wrap-method` tests from `sinon-test`.
- Extract `extend` tests from `sinon-test` to `extend-test`
- Move 'lib/util/core' tests into 'test/util/core'
- Remove the use of `sinon.format` from the codebase
- Require sinon.deepEqual in a more modular way
- Fix 648: test for this.proxy before trying toString on it
- use the correct sinon.deepEqual to test sinon matcher
- add stub test to ensure sinon matcher is recognized within stub.withArgs
- update repo link
- Remove unused dependency util
- Update samsam
- Update lolex
- Update browserify
- Update dependency pre-commit
- Update buster-istanbul to 0.1.15
- ignore webstorm configs
- fix async issues and increase buster timeout
- test on node 5
- Fixes typo error in docs
- fix typo in lib/sinon.js
- Fixes typo error in docs
- Adding comment to warn against using eval
- fix linting
- Get rid of eval in sinon spy
- Update README URLs based on HTTP redirects

## 2.0.0-pre

- 2.0.0 pre-release
- Extract `sandbox` into a CommonJS module.
- Clarify documentation on creating stubs and spies
- Extract `util/fake_server_with_clock` into a CommonJS module
- Extract `util/fake_server` into a CommonJS module.
- Extract `util/fake_timers` into a CommonJS module.
- Extract `util/fake_xml_http_request` into a CommonJS module.
- Extract `util/fake_xdomain_request` into a CommonJS module.
- Extract `util/event` into a CommonJS module.
- Extract `sinon.logError` into a CommonJS module.
- Extract (most of) sinon.collection into a CommonJS module
- Extract `sinon.mock` into a CommonJS module.
- Import mock's dependencies are CommonJS modules.
- Extract `createSpyCall` into a CommonJS module.
- Extract `sinon.assert` into a CommonJS module.
- Remove `walk` from sinon's public API.
- Patch up linting errors
- Remove `sinon` import from stub
- Extract `sinon.behavior` into a CommonJS module
- Extract `sinon.walk` into a CommonJS module.
- Export stub as a CommonJS module
- Import `wrapMethod` as a CommonJS module
- Import core dependencies as CommonJS modules
- Delete .jscsrc
- Ensure sinon can run in a WebWorker
- Updated docs to reflect that calledOn accepts a matcher
- simplified test and added a note
- updated to require spy in its new cjs form
- ./commonjs
- expose sinon.spy and sinon.spyCall
- converted spy to commonjs format
- moved sinon.format() to core
- fixed spy tests
- added missing test (pushes spy coverage to 100%)
- added spy getter/setter tests
- updated sinon.spy() to properly handle getters and setters
- Remove unnecessary error variable
- Prevent stubbed getter from being called during restore() - fixes #897
- Allowed GET requests to have request bodies
- Remove JSCS from devDependencies
- Add Gitter badge
- Allow yieldsOn, callsArgOn, callsArgOnWith, yieldsToOn to use any context
- Add bithound badge to README.md
- removed switch statement in favor of object lookup
- Use immediate exceptions
- lib/sinon/util: Remove window conditionals from IE files.
- Add docs for sandbox and utils
- Add documentation for matchers
- Add docs for assertions
- Add docs for JSON-P
- Add docs for fake server
- Add docs for fake timers
- Add mock api descriptions
- Add mocks introduction
- Add stubs api
- Update TODO
- Use Object.prototype.hasOwnProperty in deepEqual to cope with cases where hasOwnProperty doesn't exist, ie. Object.create(null), or has been overridden on an object. With tests.
- Add docs TODO to track outstanding tasks
- Add stubs.md with introduction to stubs
- Import docs
- Fix #875 Proper support UTF8 payloads _ introduced new dependency "text-encoding" _ delegate encoding operations to TextEncoder/TextDecoder \* added unit test to verify proper utf-8 encoding
- finished eslint'ing
- upgraded ESLint to 1.7.1 (latest and greatest)
- Run tests in node 4.2 LTS (Argon)
- removed unneeded path resolution
- Let npm install handle buster again, now that we have caching of node_modules
- Make travis cache node_modules to speed up builds
- removed duplicate implementation of sinon.timesInWords
- fix travis-ci build svg in README
- reviewer comments
- cleaning up left over blank lines
- CommonJS-ified _some_ of the things
- updated readyStateChange to align to the w3c spec (somewhat)
- cleaned up a few unrelated tests
- updated tests to reflect reality
- added some additional progress event verification
- added a test to ensure load is not fired before abort
- added test to ensure event ordering
- allow progress events with loaded/total values of 0
- Fix #867: Walk properties only once
- Removed unnecessary module wrappers and double test run in NodeJS.
- null-check the object passed to sinon.stub
- implemented stub#resetHistory method - fixes #863
- Fix #851: Do not attempt to re-stub constructors
- Fix #847: Ensure walk invokes accessors directly on target
- Run tests in node 4.1.x also
- stub.reset also resets behavior

## 1.17.0

- Fix #821 where Sinon.JS would leak a setImmediate into global scope
- Removed sinon-timers from the build. refs #811
- Added flag that, when set to true, makes sinon.logError throw errors synchronously.
- Fix #777: Support non-enumerable props when stubbing objects
- Made the sinon.test() function pass on errors to the callback
- Expand conversion from ArrayBuffer to binary string
- Add support for ArrayBuffer, blob responseTypes

## 1.16.1

- Bump Lolex to stop throwing an error when faking Date but not setTimeout

## 1.16.0

- Capture the stack on each spy call
- fakeServer.create accepts configuration settings
- Update Lolex to 1.3.0
- Fire onreadystatechange with event argument
- Returns supersedes previous throws
- Bunch of bug fixes

## 1.15.0

- Fixed bug where assertions don't handle functions that have a property named proxy
- update license attribute
- Add test coverage report
- responseHeaders on abort are empty object
- Fix pre-existing style error
- Update documentation to cover testing built version
- Update CONTRIBUTING.md with section about "Making a pull request"
- Improve RELEASE.md to reduce effort when cutting a new release
- Deprecate mock
- Release.md
- Make `npm docs sinon` work.
- Run unit tests against packaged version in CI environment
- Remove unused Gruntfile
- Use Vanilla Buster.JS
- Use `files` in package.json
- Fix code style
- Don't stub getter properties
- Event listeners for `progress`, `load` and `readystatechange` in the `readyStateChange` function in `FakeXMLHttpRequest` are dispatched in a different order in comparison to a browser. Reorder the events dispatched to reflect general browser behaviour.
- Update linting instructions in CONTRIBUTING.md
- Lint all files with new linter
- Update JSCS to 1.11.3 and make npm lint task verify all files
- Cleanup .restore()

## 1.14.1

- Fallback for .restore() native code functions on Chrome & PhantomJS (なつき)
- Restore support for sinon in IE<9 (Harry Wolff)

## 1.14.0

- Stub & spy getters & setters (Simon Zack)
- Fix #702 async sinon.test using mocha interface (Mohayonao)
- Add respondImmediately to fake servers (Jonathan Freeman)

## 1.13.0

- fix @depends-require mismatches (fixes AMD issues) (Ben Hockey)
- Fix spy.calledWith(undefined) to return false if it was called without args
- yieldsRight (Alexander Schmidt)
- stubs retain function arity (Charlie Rudolph)
- (AMD) use explicit define in built version
- spy().reset() returns this (Ali Shakiba)
- Add lengthComputable and download progress (Tamas Szebeni)
- Don't setContent-type when sending FormData (AJ Ortega)
- sinon.assert with spyCall (Alex Urbano)
- fakeXHR requests in Node. (Jmeas)
- Enhancement: run builds on docker (till@php.net)
- Use FakeXDomainRequest when XHR does not support CORS. Fixes #584 (Eric Wendelin)
- More lenient check for ActiveXObject
- aligned sandbox.useFakeXMLHttpRequest API to documentation (Phred)
- Fix #643. Returns supersedes previous throws (Adam Hull)
- Safely overwrite properties in IE - no more IE files!
- Add check for setInterval/clearInterval (kdpecker)
- Add safety check for document.createElement (kdpecker)
- Fix #633. Use a try/catch when deleting a property in IE8. (Garrick Cheung)

## 1.12.1

- Fixed lolex issue on node

## 1.12.0

- Fake timers are now extracted as lolex: http://github.com/sinonjs/lolex
- Improved setImmediate fake
- Proper AMD solution

## 1.11.1

- Expose match on returned sandbox (Duncan Beevers)
- Fix issue #586 (Antonio D'Ettole)
- Declare log_error dependency (Kurt Ruppel)

## 1.11.0

- Proper AMD support
- Don't call sinon.expectation.pass if there aren't any expectations (Jeffrey Falgout)
- Throw error when reset-ing while calling fake
- Added xhr.response property (Gyandeep Singh)
- Fixed premature sandbox destruction (Andrew Gurinovich)
- Add sandbox reset method (vitalets)
- A bunch of bug fixes (git log)
- Various source organizational improvements (Morgan Roderick and others)

## 1.10.3

- Fix loading in Web Workers (Victor Costan)
- Allow null as argument to clearTimeout and clearInterval (Lars Thorup)

## 1.10.2

- Fix `returnValue` and `exception` regression on spy calls (Maximilian Antoni)

## 1.10.1

- Improved mocha compatibility for async tests (Ming Liu)
- Make the fakeServer log function overloadable (Brian M Hunt)

## 1.10.0

- Ensure that spy createCallProperties is set before function invocation (James Barwell)
- XDomainRequest support (Søren Enemærke, Jonathan Sokolowski)
- Correct AMD behavior (Tim Branyen)
- Allow explicit naming of spies and stubs (Glen Mailer)
- deepEqual test for unequal objects in calledWithExactly (Bryan Donovan)
- Fix clearTimeout() for Node.js (Xiao Ma)
- fix fakeServer.respond() in IE8 (John Bernardo)
- Fix #448 (AMD require.amd)
- Fix wrapMethod error handling (Nikita Litvin)

## 1.9.1

- Fix an issue passing `NaN` to `calledWith` (Blake Israel)
- Explicate dependency on util package (Kris Kowal)
- Fake timers return an object with `ref` and `unref` properties on Node (Ben Fleis)

## 1.9.0

- Add sinon.assert.match (Robin Pedersen)
- Added ProgressEvent and CustomEvent. Fixes bug with progress events on IE. (Geries Handal)
- prevent setRequestHeaders from being called twice (Phred)
- Fix onload call, 'this' should be equal to XHR object (Niklas Andreasson)
- Remove sandbox injected values on restore (Marcus Hüsgen)
- Coerce matcher.or/and arguments into matchers (Glen Mailer)
- Don't use buster.format any more
- Fix comparison for regexp deepEqual (Matt Kern)

## 1.8.2

- Fixes an edge case with calledWithNew and spied native functions, and other
  functions that lack a .prototype
- Add feature detection for the new ProgressEvent support

## 1.8.1

- Screwed up NPM release of 1.8.0, unable to replace it

## 1.8.0

- Add clearImmediate mocking support to the timers API (Tim Perry)
- Mirror custom Date properties when faking time
- Improved Weinre support
- Update call properties even if exceptions are thrown (Tim Perry)
- Update call properties even if exceptions are thrown (Tim Perry)
- Reverse matching order for fake server (Gordon L. Hempton)
- Fix restoring globals on another frame fails on Firefox (Burak Yiğit Kaya)
- Handle stubbing falsy properties (Tim Perry)
- Set returnValues correctly when the spied function is called as a constructor (Tim Perry)
- When creating a sandbox, do not overwrite existing properties when inject
  properties into an object (Sergio Cinos)
- Added withCredentials property to fake xhr (Geries)
- Refine behavior withArgs error message (Tim Fischbach)
- Auto-respond to successive requests made with a single XHR object (Jan Suchý)
- Add the ability for mock to accept sinon.match matchers as expected arguments (Zcicala)
- Adding support for XMLHttpRequest.upload to FakeXMLHttpRequest (Benjamin Coe)
- Allow onCall to be combined with returns\* and throwsException in stub behavior
  sequences (Tim Fischbach)
- Fixed deepEqual to detect properties on array objects
- Fixed problem with chained timers with delay=0 (Ian Lewis)
- Use formatio in place of buster-format (Devin Weaver)

## 1.7.3

- Removed use of array forEach, breaks in older browsers (Martin Hansen)
- sinon.deepEqual(new Date(0), new Date()) returns true (G.Serebryanskyi)

## 1.7.2

- Sinon 1.7 has split calls out to a separate file. This caused some problems,
  so 1.7.2 ships with spyCall as part of spy.js like it used to be.

## 1.7.1

- Fake XMLHttpRequest updated to call onerror and onsuccess callbacks, fixing
  jQuery 2.0 problems (Roman Potashow)
- Implement XMLHttpRequest progress event api (Marten Lienen)
- Added sinon.restore() (Jonny Reeves)
- Fix bug where throwing a string was handled incorrectly by Sinon (Brandon Heyer)
- Web workers support (Victor Costan)

## 1.7.0

- Failed release, see 1.7.1

## 1.6.0

- Add methods to spyCall interface: callArgOn, callArgOnWith, yieldOn,
  yieldToOn (William Sears)
- sinon.createStubInstance creates a fully stubbed instance from a constructor
  (Shawn Krisman)
- resetBehavior resets fakes created by withArgs (Martin Sander)
- The fake server now logs to sinon.log, if set (Luis Cardoso)
- Cleaner npm package that also includes pkg/sinon.js and
  pkg/sinon-ie.js for cases where npm is used to install Sinon for
  browser usage (Domenic Denicola)
- Improved spy formatter %C output (Farid Neshat)
- clock.tick returns clock.now (Michael Jackson)
- Fixed issue #248 with callOrder assertion
  Did not fail if the last given spy was never called (Maximilian Antoni)
- Fixed issue with setResponseHeader for synchronous requests (goligo)
- Remove msSetImmediate; it only existed in IE10 previews (Domenic Denicola)
- Fix #231: not always picking up the latest calls to callsArgWith, etc.
  (Domenic Denicola)
- Fix failing anonymous mock expectations

## 1.5.2

- Revert stub.reset changes that caused existing tests to fail.

## 1.5.1

- Ensure window.Image can be stubbed. (Adrian Phinney)
- Fix spy() in IE 8 (Scott Andrews)
- Fix sinon base in IE 8 (Scott Andrews)
- Format arguments output when mock expectation is not met (kbackowski)
- Calling spy.reset directly from stub.reset (Thomas Meyer)

## 1.5.0

- Don't force "use strict" on Sinon consumers
- Don't assume objects have hasOwnProperties. Fixes problem with e.g.
  stubbing properties on process.env
- Preserve function length for spy (Maximilian Antoni)
- Add 'invokeCallback' alias for 'yield' on calls (Maximilian Antoni)
- Added matcher support for calledOn (Maximilian Antoni)
- Retain original expectation messages, for failed mocks under sinon.test
  (Giorgos Giannoutsos)
- Allow yields* and callsArg* to create sequences of calls. (Domenic Denicola)
- sinon.js can catch itself in endless loop while filling stub prototype
  with asynch methods (Jan Kopriva)

## 1.4.2

- sinon.match for arrays (Maximilian Antoni)

## 1.4.1

- Strengthen a Node.JS inference to avoid quirky behavior with Mocha
  (which provides a shim process object)

## 1.4.0

- Argument matchers (Maximilian Antoni)
  sinon.match.{any, same, typeOf, instanceOf, has, hasOwn, defined, truthy,
  falsy} as well as typeOf shortcuts for boolean, number, string, object,
  function, array, regexp and date. The result of a call can be used with
  spy.calledWith.
- spy.returned now works with matchers and compares objects deeply.
- Matcher assertions: calledWithMatch, alwaysCalledWithMatch and
  neverCalledWithMatch
- calledWithNew and alwaysCalledWithNew for assert (Maximilian Antoni)
- Easier stubbed fluent interfaces: stub.returnsThis() (Glen Mailer)
- allow yields() and family to be used along with returns()/throws() and
  family (Glen Mailer)
- Async versions `callsArg*` and `yields*` for stubs (TEHEK)
- Format args when doing `spy.printf("%*")` (Domenic Denicola)
- Add notCalled property to spies
- Fix: spy.reset did not reset fakes created by spy.withArgs (Maximilian Antoni)
- Properly restore stubs when stubbing entire objects through the sandbox
  (Konrad Holowinski)
- Restore global methods properly - delete properties that where not own
  properties (Keith Cirkel)
- setTimeout and setInterval pass arguments (Rodion Vynnychenko)
- Timer callbacks that contain a clock.tick no longer fails (Wesley Waser)
- spy(undefined, "property") now throws
- Prevent multiple restore for fake timers (Kevin Decker)
- Fix toString format under Node (Kevin Decker)
- Mock expectations emit success and failure events (Kevin Decker)
- Development improvement: Use Buster.JS to test Sinon
- Fix bug where expect.atLeast failed when minimum calls where received
- Make fake server safe to load on node.js
- Add support for no args on .withArgs and .withExactArgs (Tek Nynja)
- Avoid hasOwnProperty for host objects

## 1.3.2

- Stronger Node inference in sandbox
- Fixed issue with sinon.useFakeTimers() and Rhino.js 1.7R3
- Formatting brush-up
- FIX Internet Explorer misreporting the type of Function objects
  originating in an external window as "object" instead of "function".
- New methods stub.callsArgOn, stub.callsArgOnWith,
  stub.yieldsOn, stub.yieldsToOn
- Implemented
- Fixing `clearTimeout` to not throw when called for nonexistent IDs.
- Spys that are created using 'withArgs' now get initialized with previous
  calls to the original spy.
- Minor bug fixes and docs cleanup.

## 1.3.1

- Fix bug in core sinon: isNode was used for both a variable and a function,
  causing load errors and lots of bugs. Should have never left the door.

## 1.3.0

- Support using bare functions as fake server response handlers (< 1.3.0
  required URL and/or method matcher too)
- Log some internal errors to sinon.log (defaults to noop). Set sinon.log
  to your logging utility of choice for better feedback when.
- White-list fake XHRs: Allows some fake requests and some that fall through to
  the backend server (Tim Ruffles)
- Decide Date.now support at fake-time. Makes it possible to load something that
  polyfills Date.now after Sinon loaded and still have Date.now on fake Dates.
- Mirror properties on replaced function properties
- New methods: spy.yield(), spy.yieldTo(), spy.callArg() and spy.callArgWith()
  can be used to invoke callbacks passed to spies (while avoiding the mock-like
  upfront yields() and friends). invokeCallback is available as an alias for
  yield for people working with strict mode. (Maximilian Antoni)
- New properties: spy.firstCall, spy.secondCall, spy.thirdCall and spy.lastCall.
  (Maximilian Antoni)
- New method: stub.returnsArg(), causes stub to return one of its arguments.
  (Gavin Huang)
- Stubs now work for inherited methods. This was previously prohibited to avoid
  stubbing not-yet-implemented methods. (Felix Geisendörfer)
- server.respond() can now accept the same arguments as server.respondWith() for
  quick-and-dirty respondWith+respond. (Gavin Huang)
- Format objects with buster-format in the default bundle. Default to
  util.inspect on node unless buster-format is available (not a hard dependency,
  more like a 'preference').

- Bug fix: Make sure XHRs can complete even if onreadystatechange handler fails
- Bug fix: Mirror entire Date.prototype, including toUTCString when faking
- Bug fix: Default this object to global in exposed asserts
- Bug fix: sinon.test: use try/finally instead of catch and throw - preserves
  stack traces (Kevin Turner)
- Bug fix: Fake `setTimeout` now returns ids greater than 0. (Domenic Denicola)
- Bug fix: NPM install warning (Felix Geisendörfer)
- Bug fix: Fake timers no longer swallows exceptions (Felix Geisendörfer)
- Bug fix: Properly expose all needed asserts for node
- Bug fix: wrapMethod on window property (i.e. when stubbing/spying on global
  functions)
- Bug fix: Quote "yield" (Ben Hockey)
- Bug fix: callOrder works correctly when spies have been called multiple times

## 1.2.0

- Bug fix: abort() switches state to DONE when OPENED and sent. Fix by
  Tristan Koch.
- Bug fix: Mootools uses MSXML2.XMLHTTP as objectId, which Sinon matched with
  different casing. Fix by Olmo Maldonado.
- Bug fix: When wrapping a non-owned property, restore now removes the wrapper
  instead of replacing it. Fix by Will Butler.
- Bug fix: Make it possibly to stub Array.prototype.push by not using that
  method directly inside Sinon.
- Bug fix: Don't assume that req.requestBody is a string in the fake server.
- Added spy.printf(format) to print a nicely formatted message with details
  about a spy.
- Garbage collection: removing fakes from collections when restoring the
  original methods. Fix by Tristan Koch.
- Add spy.calledWithNew to check if a function was used as a constructor
- Add spy.notCalledWith(), spy.neverCalledWith() and
  sinon.assert.neverCalledWith. By Max Antoni
- Publicly expose sinon.expectation.fail to allow tools to integrate with mock
  expectations.
- Fake XMLHttpRequests now support a minimal portion of the events API, making
  them work seamlessly with e.g. SproutCode (which uses
  xhr.addEventListener("readystatechange"). Partially by Sven Fuchs.

## 1.1.1

- Fix broken mock verification in CommonJS when not including the full Sinon
  package.

## 1.1.0

- The fake server now has a autoRespond method which allows it to respond to
  requests on the fly (asynchronously), making it a good fit for mockup
  development
- Stubs and spies now has a withArgs method. Using it allows you to create
  several spies/stubs for the same method, filtered by received arguments
- Stubs now has yields and yieldsTo methods for fuzzily invoking callbacks.
  They work like callsArgAt only by inferring what callback to invoke, and
  yieldsTo can invoke callbacks in object "options" arguments.
- Allow sandboxes/collections to stub any property so long as the object
  has the property as an own property
- Significantly improve error reporting from failed mock expectations. Now prints
  all met and unmet expectations with expected and received arguments
- Allow mock expectations to be consumed in any order
- Add pretty printing of all calls when assertions fail
- Fix bug: Stub exception message ended up as "undefined" (string) if not
  specified
- Pass capture groups in URLs to fakeServer function handlers
- Pass through return value from test function in testCase
- typeof require is not enough to assume node, also use typeof module
- Don't use Object.create in sinon.create. In the off chance that someone stubs
  it, sinon will fail mysteriously (Thanks to Espen Dalløkken)
- Catch exceptions when parsing DOM elements "on a hunch"
  When responding to XHRs, Sinon acts like most browsers and try to parse the
  response into responseXML if Content-Type indicates XML or HTML. However, it
  also does this if the type is not set. Obviously, this may misfire and
  should be caught.
- Fix fakeServer.respond() to not drop requests when they are queued during the
  processing of an existing queue. (Sven Fuchs)
- Clean up module loading in CommonJS environments (Node.js still the only
  tested such environment). No longer (temporarily) modifies require.paths,
  always loads all modules.

## 1.0.2

- Fix JSON bug in package.json
- Sandbox no longer tries to use a fake server if config says so, but
  server is not loaded

## 1.0.1

- Make sure sinon.sandbox is exposed in node.js (fix by Gord Tanner)

## 1.0.0

- Switched indentation from 2 to 4 spaces :)
- Node.js compatibility improvements
- Remove magic booleans from sinon.assert.expose, replace with option object
- Put QUnit adapter in its own repository
- Update build script to build standalone timers and server files
- Breaking change: thisObj -> thisValue
  Change brings consistency to the code-base, always use thisValue
- Add sinon.assert.pass callback for successful assertions
- Extract sandbox configuration from sinon.test

  Refactored sinon.test to not do all the heavy lifting in creating sandbox
  objects from sinon.config. Now sinon.sandbox.create accepts an optional
  configuration that can be retrieved through sinon.getConfig({ ... }) - or, to
  match previous behavior, through sinon.getConfig(sinon.config);

  The default configuration now lives in sinon.defaultConfig rather than the
  previous sinon.test.

  This change enables external tools, such as test framework adapters, to easily
  create configurable sandboxes without going through sinon.test

- Rewrite sinon.clock.tick to fix bug and make implementation clearer
- Test config load correct files
- Make timers and XHR truly standalone by splitting the IE work-around in two files
- Don't fail when comparing DOM elements in sinon.deepEqual (used in calledWith(...))
- Should mirror properties on Date when faking it
- Added and updated configuration for both JsLint and JavaScript lint
- [August Lilleaas] The build script can optionally build a file without the
  version name in it, by passing 'plain', i.e. './build plain'.

  Useful when using the build script to build and use sinon programatically, so
  one can 'cp path/to/sinon/pkg/sinon.js my/scripts/'

- [August Lilleaas] Checking and warning if we got a load error and rubygems
  isn't present.
- [August Lilleaas] Updating build script to be runnable from any
  directory. Current working directory doesn't have to be repo root.

## 0.8.0

- sinon.wrapMethod no longer accepts faking already faked methods
- sinon-qunit 'plugin'
- sinon.test / sinon.config can now expose the sandbox object

## 0.7.2

- Add sinon.sandbox.create back in
- Fix bug where clock.tick would fire timeouts in intervals when
  setInterval was also called

## 0.7.1

- The fake server will now match paths against full URLs, meaning that
  server.respondWith("/", "OK"); will match requests for
  "http://currentHost/".
- Improved toString method for spies and stubs which leads to more
  precise error messages from sinon.assert.\*

## 0.7.0

- sinon.useFakeTimers now fakes the Date constructor by default
- sinon.testCase now fakes XHR and timers by default
- sinon.config controls the behavior of sinon.testCase
- Fixed bug in clock.tick - now fires timers in correct order
- Added the ability to tick a clock string for longer ticks.
  Passing a number causes the clock to tick the specified amount of
  milliseconds, passing a string like "12:32" ticks 12 minutes and 32
  seconds.
- calledBefore and calledAfter for individual calls
- New assertions
  sinon.assert.notCalled
  sinon.assert.calledOnce
  sinon.assert.calledTwice
  sinon.assert.calledThrice
- sinon.test now throws if passed anything other than a function
- sinon.testCase now throws if passed anything other than an object
- sinon.{spy,stub}(obj, method) now throws if the property is not an
  existing function - helps avoid perpetuating typo bugs
- Vastly improved error messages from assertions
- Spies/stubs/expectations can have their names resolved in many cases
- Removed feature where sinon.testCase allowed for nested test cases
  (does not belong in Sinon.JS)
- Organizational change: src/ becomes lib/ Helps npm compatibility
- Thanks to Cory Flanigan for help on npm compatibility

## 0.6.2

- Fixed another bug in sinon.fakeServerWithClock where consecutive
  respond() calls did not trigger timeouts.

## 0.6.1

- Fixed a bug in sinon.fakeServerWithClock where the clock was ticked
  before the server had responded to all requests, resulting in
  objects not having been responded to by the time the timeout ran.

## 0.6.0

- FakeXMLHttpRequest
- sinon.useFakeXMLHttpRequest
- sinon.fakeServer
- sinon.fakeServerWithClock
- Improved fake timers implementation, made them work properly in IE 6-8
- Improved sinon.sandbox
  - Added useFakeServer
  - Added inject method
- Improved sinon.test method
  - Made configuration aware
  - Now uses sinon.sandbox in place of sinon.collection
- Changed default configuration for sinon.test, breaking compatibility
  with 0.5.0 - can be changed through sinon.config

## 0.5.0

- Initial release
- Spies, stubs, mocks
- Assertions
- collections, test, testCase
- Fake timers (half-baked)
