import { App } from '@/app';

// plop_append_import
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';

import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute()]);

app.listen();
