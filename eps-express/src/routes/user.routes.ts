import { Router } from "express";
import { AppDataSource } from "../configs/typeorm.config";
import { User } from "../entities/user.entity";

export const userRouter = Router();
const userRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   age:
 *                     type: integer
 */
userRouter.get("/", async (req, res) => {
  const users = await userRepository.find();
  res.json(users);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 */
userRouter.post("/", async (req, res) => {
  const user = userRepository.create(req.body);
  const results = await userRepository.save(user);
  res.status(201).json(results);
});
