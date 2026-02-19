import { createMocks } from 'node-mocks-http'
import { describe, expect, it } from 'vitest'

import { POST } from '@/app/api/auth/login/route'

describe('POST /api/auth/login', () => {
  it('returns 400 when email/password is missing', async () => {
    const { req } = createMocks({
      method: 'POST',
      url: '/api/auth/login',
      body: { email: '' },
    })

    const request = new Request(`http://localhost${req.url}`, {
      method: req.method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    })

    const response = await POST(request as never)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Email and password are required',
    })
  })
})
