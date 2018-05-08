# Express-bitmask-permissions
Middleware that takes:
- On middleware construction:
  - A route sections object defining a route group affinity
  - `generic-bitmask` descriptor body defining a bitmask bit permission affinity
- Runtime:
  - An array of user bitmasks

And produces an array of permission in `req.permissions` for requested route based on its predefined section 

## Installation 
```sh
npm install git+ssh://git@code.42px.org:42px/express-bitmask-permissions.git --save
```

## Usage

### TypeScript
```JS
import PBM from 'express-bitmask-permissions';
import * as jwt from 'express-jwt';

const app = express();

const options = {
  // (required) Route section affinity
  sections: {
    '/cats': 0,
    '/dogs': 1
  },
  // (required) Bit permission affinity
  // Starts with 1
  descriptorBody: {
    'feed': 1,
    'pet': 2,
    'play': 3
  }
  // (optional) JWT field with bitmasks array
  // 'masks' by default
  masksField: 'masks' 
};

app.use(PBM(options));

...

app.post('/cats/:name/pet', function(req, res, next) {

  // req.permissions is now array of values
  // from descriptor, or is empty

  if (!req.permissions.includes('pet')) 
    return res
      .status(403)
      .send(`You're not allowed to pet ${req.params.name}`);

  pet.cat(name);

  res.send(`Cat ${req.params.name} purrs`);

})

```

## How it works
Middleware does following:

- Takes `sections` definition from options to decide which particular bitmask to check against
    - `'cats': 0` will check any request starting with url element '/cats' against `req.user.masks[0]`
- Extracts bitmask array from `req.user` using default `masks` field or one provided in `masksField` option
- Selects particular bitmask from array based on request url `section` base element match 
    - e.g. '/cats' is a base element for a '/cats/43/kitties?fluffy=yes'
- `Descriptor` is used to extract human-readable permissions from the bitmask



Sections:
```JS
{
  '/cats': 0,
  '/dogs': 1
}
```

Descriptor: 
```JS
{
  'feed': 1,
  'pet': 2,
  'play': 3
}
```

Bitmask array:
```JS
[ 777, 0 ]
```

On init middleware with predefined section and descriptor defnition is produced

On request:
- `POST /cats/17/pet`
- Express `req` provides an array of user bitmasks extracted by other middleware 
    - `req.user.masks === [ 777, 0 ]`
- Bitmask selected from an array with the help of a `section` definition
    - `req.user.masks[sections[req.baseUrl]] === 777`
- `generic-bitmask` is used to extract an array of permissions from the bitmask `777` to the array `description`
    - `req.permissions === [ 'feed', 'pet', 'play' ]`
- Access control happens downstream

