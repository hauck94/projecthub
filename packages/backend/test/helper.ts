import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import * as path from 'path';
import { Connection, createConnection, ObjectType } from 'typeorm';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli';
import { globalRouter } from '../src/router/global.router';
import { Authentication } from '../src/middleware/authentication';
import { User } from '../src/entity/User';
import { Project } from '../src/entity/Project';
import { Widget } from '../src/entity/Widget';
import { ProjectMember} from '../src/entity/ProjectMember';

export class Helper {
  public app: Express | null;
  private dbConnection: Connection;

  public async init() {
    jest.setTimeout(10000);
    this.app = express();
    this.app.use(bodyParser.json());

    this.app.use('/api', globalRouter);
    
    /*const config = await getConnectionOptions('default');
    this.dbConnection = await createConnection(
      // tslint:disable-next-line: prefer-object-spread
      Object.assign({}, config, { database: process.env.DBDATABASE })
    )*/
    this.dbConnection = await createConnection(
      {
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [User, Project, Widget, ProjectMember],
        synchronize: true,
        logging: false,
      },
    );
    await this.resetDatabase();
    await this.loadFixtures();
  }
  public resetDatabase = async () => {
    await this.dbConnection.synchronize(true);
  };

  public async loadFixtures() {
    const loader = new Loader();
    loader.load(path.resolve('./src/fixture/'));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(this.dbConnection, new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = (await builder.build(fixture)) as any;
      if (entity === 'User') {
        await this.getRepo(entity.constructor.name).save(User);
      }
      if (entity === 'Project') {
        await this.getRepo(entity.constructor.name).save(Project);
      }
      if (entity === 'Widget') {
        await this.getRepo(entity.constructor.name).save(Widget);
      }
      if (entity === 'ProjectMember') {
        await this.getRepo(entity.constructor.name).save(ProjectMember);
      }
    }
  }

  public async shutdown() {
    return this.dbConnection.close();
  }

  public getConnection() {
    return this.dbConnection;
  }

  public getRepo<Entity>(target: ObjectType<Entity>) {
    return this.dbConnection.getRepository(target);
  }

  public async loginUser(userEmail: string) {
    const user = await this.getRepo(User).findOneOrFail({ email: userEmail });
    return Authentication.generateToken({
      email: user.email,
      id: user.id,
    });
  }
}
