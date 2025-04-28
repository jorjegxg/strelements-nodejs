/**import { prisma } from "@/config/db";

export const authRepository = {
  createUser: (data: { email: string; username: string; password: string; }) => {
    return prisma.user.create({ data });
  },
  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },
};

deci conectare la baza de date
 */