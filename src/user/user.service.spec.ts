import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';

describe('UserService', () => {
  let service: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repo: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        rg: '123456789',
        photo_path: 'photo.jpg',
      };

      const createdUser: User = {
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
        rg: createUserDto.rg,
        photo_path: createUserDto.photo_path,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(plainToInstance(CreateUserDto, createdUser));
    });
  });

  describe('UserService', () => {
    let service: UserService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let repo: Repository<User>;

    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: getRepositoryToken(User),
            useValue: mockRepository,
          },
        ],
      }).compile();

      service = module.get<UserService>(UserService);
      repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('findAll', () => {
      it('should return an array of users transformed to CreateUserDto', async () => {
        const users: User[] = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            rg: '123456789',
            photo_path: 'photo.jpg',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 2,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            rg: '987654321',
            photo_path: 'photo.jpg',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ];

        mockRepository.find.mockResolvedValue(users);

        const result = await service.findAll();

        expect(mockRepository.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(plainToInstance(CreateUserDto, users));
      });
    });

    describe('findOne', () => {
      it('should return a user transformed to CreateUserDto when found', async () => {
        const user: User = {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          rg: '123456789',
          photo_path: 'photo.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        };

        mockRepository.findOne.mockResolvedValue(user);

        const result = await service.findOne(1);

        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
        });
        expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        expect(result).toEqual(plainToInstance(CreateUserDto, user));
      });

      it('should return null if no user is found', async () => {
        mockRepository.findOne.mockResolvedValue(null);

        const result = await service.findOne(99);

        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { id: 99 },
        });
        expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
      });
    });
  });
  describe('UserService', () => {
    let service: UserService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let repo: Repository<User>;

    const mockRepository = {
      update: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: getRepositoryToken(User),
            useValue: mockRepository,
          },
        ],
      }).compile();

      service = module.get<UserService>(UserService);
      repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('update', () => {
      it('should update a user and return the updated user', async () => {
        const id = 1;
        const updateUserDto: Partial<User> = { name: 'Updated Name' };

        const updatedUser: User = {
          id,
          name: 'Updated Name',
          email: 'user@example.com',
          rg: '123456789',
          photo_path: 'photo.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        };

        mockRepository.update.mockResolvedValue({ affected: 1 });
        mockRepository.findOne.mockResolvedValue(updatedUser);

        const result = await service.update(id, updateUserDto);

        expect(mockRepository.update).toHaveBeenCalledWith(id, updateUserDto);
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
        expect(result).toEqual(updatedUser);
      });

      it('should return null if the user is not found after update', async () => {
        const id = 1;
        const updateUserDto: Partial<User> = { name: 'Updated Name' };

        mockRepository.update.mockResolvedValue({ affected: 1 });
        mockRepository.findOne.mockResolvedValue(null);

        const result = await service.update(id, updateUserDto);

        expect(mockRepository.update).toHaveBeenCalledWith(id, updateUserDto);
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
        expect(result).toBeNull();
      });
    });

    describe('remove', () => {
      it('should remove a user and return the removed user', async () => {
        const id = 1;
        const user: User = {
          id,
          name: 'John Doe',
          email: 'john.doe@example.com',
          rg: '123456789',
          photo_path: 'photo.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        };

        mockRepository.findOneBy.mockResolvedValue(user);
        mockRepository.remove.mockResolvedValue(user);

        const result = await service.remove(id);

        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
        expect(mockRepository.remove).toHaveBeenCalledWith(user);
        expect(result).toEqual(plainToInstance(CreateUserDto, user));
      });

      it('should throw an error if the user is not found', async () => {
        const id = 1;

        mockRepository.findOneBy.mockResolvedValue(null);

        await expect(service.remove(id)).rejects.toThrow(
          'O usuário não foi encontrado.',
        );

        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
        expect(mockRepository.remove).not.toHaveBeenCalled();
      });
    });
  });
  describe('UserService', () => {
    let service: UserService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let repo: Repository<User>;

    const mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: getRepositoryToken(User),
            useValue: mockRepository,
          },
        ],
      }).compile();

      service = module.get<UserService>(UserService);
      repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('uploadFile', () => {
      it('should update the photo path of an existing user and return the updated user', async () => {
        const id = 1;
        const photoPath = '/uploads/user-photo.jpg';
        const user: User = {
          id,
          name: 'John Doe',
          email: 'john.doe@example.com',
          rg: '123456789',
          created_at: new Date(),
          updated_at: new Date(),
          photo_path: null,
        };

        const updatedUser: User = { ...user, photo_path: photoPath };

        mockRepository.findOne.mockResolvedValue(user);
        mockRepository.save.mockResolvedValue(updatedUser);

        const result = await service.uploadFile(id, photoPath);

        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
        expect(mockRepository.save).toHaveBeenCalledWith({
          ...user,
          photo_path: photoPath,
        });
        expect(result).toEqual(updatedUser);
      });

      it('should throw an error if the user is not found', async () => {
        const id = 99;
        const photoPath = '/uploads/user-photo.jpg';

        mockRepository.findOne.mockResolvedValue(null);

        await expect(service.uploadFile(id, photoPath)).rejects.toThrow(
          'O usuário não foi encontrado.',
        );

        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
        expect(mockRepository.save).not.toHaveBeenCalled();
      });
    });
  });
});
