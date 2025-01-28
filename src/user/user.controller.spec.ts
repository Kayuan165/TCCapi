import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let userController: UserController;
  // eslint-disable-next-line
  let userService: UserService;

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

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with valid data and file', async () => {
      const file = {
        originalname: 'photo.jpg',
        filename: 'unique-photo.jpg',
      } as Express.Multer.File;

      const body = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        rg: '123456789',
        photo_path: 'upload/teste.jpg',
      };

      const createUserDto: CreateUserDto = {
        name: body.name,
        email: body.email,
        rg: body.rg,
        photo_path: `uploads/${file.filename}`,
      };

      mockUserService.create.mockResolvedValue(createUserDto);

      const result = await userController.create(file, body);

      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createUserDto);
    });

    it('should throw an error if required fields are missing', async () => {
      expect(() =>
        userController.create(null, { name: '', rg: '', email: '' }),
      ).toThrow('Nome, RG e Email são obrigatórios');
    });

    it('should create a user without a file (photo_path should be null)', async () => {
      const file = null;
      const body = {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        rg: '987654321',
        photo_path: null,
      };

      const createUserDto: CreateUserDto = {
        name: body.name,
        email: body.email,
        rg: body.rg,
        photo_path: null,
      };

      mockUserService.create.mockResolvedValue(createUserDto);

      const result = await userController.create(file, body);

      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: CreateUserDto[] = [
        {
          name: 'John',
          email: 'john@example.com',
          rg: '123456',
          photo_path: 'uploads/photo1.jpg',
        },
        {
          name: 'Jane',
          email: 'jane@example.com',
          rg: '654321',
          photo_path: 'uploads/photo2.jpg',
        },
      ];

      mockUserService.findAll.mockResolvedValue(users);

      const result = await userController.findAll();

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const user: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        rg: '123456',
        photo_path: 'uploads/photo.jpg',
      };

      mockUserService.findOne.mockResolvedValue(user);

      const result = await userController.findOne('1');

      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = {
        id: 1,
        name: 'Updated Name',
        email: 'johndoe@example.com',
        rg: '123456',
        photo_path: 'uploads/photo.jpg',
      };

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await userController.update('1', updateUserDto);

      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      const removedUser: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        rg: '123456',
        photo_path: 'uploads/photo.jpg',
      };

      mockUserService.remove.mockResolvedValue(removedUser);

      const result = await userController.remove('1');

      expect(mockUserService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(removedUser);
    });
  });
});
