import { ApolloServer } from "apollo-server";
import { resolvers as resolversU, typeDefs as typeDefsU} from "./modules/users/main.js";
import { resolvers as resolversG, typeDefs as typeDefsG} from "./modules/genres/main.js";
import { resolvers as resolversB, typeDefs as typeDefsB} from "./modules/bands/main.js";
import { resolvers as resolversAr, typeDefs as typeDefsAr} from "./modules/artists/main.js";
import { resolvers as resolversT, typeDefs as typeDefsT} from "./modules/tracks/main.js";
import { resolvers as resolversAl, typeDefs as typeDefsAl} from "./modules/albums/main.js";
import { resolvers as resolversF, typeDefs as typeDefsF} from "./modules/favourites/main.js";
import lodash from "lodash";

const typeDefs = [typeDefsU, typeDefsG, typeDefsB, typeDefsAr, typeDefsT, typeDefsAl, typeDefsF];

const resolvers = lodash.merge({}, resolversU, resolversG, resolversB, resolversAr, resolversT, resolversAl, resolversF);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    cache: 'bounded',
});
  
server.listen().then(({ url }) => {  
    console.log(`🚀  Server ready at ${url}`);
});