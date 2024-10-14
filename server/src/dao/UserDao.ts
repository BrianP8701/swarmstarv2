import { Prisma, PrismaClient, Swarm, User, InformationGraph, UserToPanelLayoutMapping } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractDao } from './AbstractDao'

@injectable()
export class UserDao extends AbstractDao<User, Prisma.UserCreateInput, Prisma.UserUpdateInput, Prisma.UserInclude> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma)
  }

  // CRUD methods
  async get(id: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return user !== null
  }

  async create(userCreateInput: Prisma.UserCreateInput, includeClauses?: Prisma.UserInclude): Promise<User> {
    return this.prisma.user.create({
      data: userCreateInput,
      include: includeClauses,
    })
  }

  async update(id: string, updateInput: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }

  // Additional methods
  async getWithData(id: string): Promise<
    User & {
      swarms: Swarm[]
      informationGraphs: InformationGraph[]
      userToPanelLayoutMappings: UserToPanelLayoutMapping[]
    }
  > {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        swarms: true,
        informationGraphs: true,
        userToPanelLayoutMappings: {
          orderBy: { lastUsed: 'desc' },
          include: {
            panelLayout: true,
          },
        },
      },
    })
    return user
  }

  async getSwarms(id: string): Promise<Swarm[]> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { swarms: true },
    })
    return user.swarms
  }

  async getInformationGraphs(id: string): Promise<InformationGraph[]> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { informationGraphs: true },
    })
    return user.informationGraphs
  }
}
