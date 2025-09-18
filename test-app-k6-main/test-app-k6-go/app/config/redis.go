// Package config handles the initialization and configurations.
// Author: Tri Wicaksono
// Website: https://triwicaksono.com
package config

import (
	"app/helpers"
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%s", helpers.GetEnv("REDIS_HOST", "redis"), helpers.GetEnv("REDIS_PORT", "6379")),
	})

	err := RedisClient.Ping(context.Background()).Err()
	if err != nil {
		panic(err)
	}
}
