import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Express } from 'multer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

describe('UserController', () => {
  let controller: UserController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        rg: '123456789',
        photo_path: 'uploads/photo.jpg',
      };
      const createdUser = { id: 1, ...createUserDto };

      mockUserService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          rg: '123456789',
          photo_path: 'uploads/photo.jpg',
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          rg: '987654321',
          photo_path: 'uploads/photo.jpg',
        },
      ];

      mockUserService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        rg: '123456789',
        photo_path: 'uploads/photo.jpg',
      };

      mockUserService.findOne.mockResolvedValue(user);

      const result = await controller.findOne('1');

      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = {
        id: 1,
        name: 'Updated Name',
        email: 'john.doe@example.com',
        rg: '123456789',
        photo_path: 'uploads/photo.jpg',
      };

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);

      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user and return the removed user', async () => {
      const removedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        rg: '123456789',
        photo_path: 'uploads/photo.jpg',
      };

      mockUserService.remove.mockResolvedValue(removedUser);

      const result = await controller.remove('1');

      expect(mockUserService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(removedUser);
    });
  });

  describe('uploadFile', () => {
    it('should return the file path after upload', () => {
      const file = {
        originalname: 'file.jpg',
        filename: `${uuidv4()}.jpg`,
      } as Express.Multer.File;

      const result = controller.uploadFile(file);

      expect(result).toEqual({ filePath: `uploads/${file.filename}` });
    });
  });
});
