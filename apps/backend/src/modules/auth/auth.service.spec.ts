import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    _id: { toString: () => 'user-id-123' },
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: 'hashed_password_abc',
    phone: '+4917612345',
    role: 'customer' as const,
    addresses: [],
  };

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('mock_jwt_secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should register a new user successfully', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser as any);

      const result = await service.signup({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+4917612345',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe('john@example.com');
      expect(usersService.create).toHaveBeenCalledWith(
        'John Doe',
        'john@example.com',
        expect.any(String),
        '+4917612345',
      );
    });

    it('should throw ConflictException if email is already registered', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any);

      await expect(
        service.signup({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should log in a user successfully with correct credentials', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.login({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result.user.id).toBe('user-id-123');
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'john@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        service.login({
          email: 'john@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
