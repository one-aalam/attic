import path from 'path';
import bodyParse from 'body-parser';
import multer from 'multer';


import { requireAuth } from '../lib/middlewares/require-auth';
import { tokenAuth } from 'lib/middlewares/token-auth';
import { findOneOrThrow } from 'services/user.service';
import { enforce } from 'lib/middlewares/enforce';
import { isAdmin, isOwner } from './route.policy';

export const bodyParser = bodyParse.json({
    limit: '100kb',
});

const storage = multer.diskStorage({
  destination(_, __, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename(_, _file, cb) {
    cb(null, Date.now() + path.extname(_file.originalname)); // Appending extension
  },
});

const upload = multer({ storage });

export const __POST = [ bodyParser, upload.array('avatarUrl') ]
export const __PROTECTED = [ tokenAuth(findOneOrThrow), requireAuth ]

export const __OWNER = [ enforce(isOwner) ]
export const __ADMIN = [ enforce(isAdmin) ]

export const __POST_OWNER = [...__POST, ...__OWNER ]
export const __POST_ADMIN = [...__POST, ...__ADMIN ]

export const __PROTECTED_POST = [ ...__POST, ...__PROTECTED ]
export const __OWNER_ADMIN = [ ...__OWNER, ...__ADMIN ]

export const __PROTECTED_OWNER = [ ...__PROTECTED, ...__OWNER ]
export const __PROTECTED_ADMIN = [ ...__PROTECTED, ...__ADMIN ]
export const __PROTECTED_OWNER_ADMIN = [ ...__PROTECTED, ...__OWNER_ADMIN ]

export const __PROTECTED_POST_OWNER = [ ...__PROTECTED_POST, ...__OWNER ]
export const __PROTECTED_POST_ADMIN = [ ...__PROTECTED_POST, ...__ADMIN ]
export const __PROTECTED_POST_OWNER_ADMIN = [ ...__PROTECTED_POST, ...__OWNER_ADMIN]
