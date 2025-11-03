<script lang="ts">
  import { setContext } from 'svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { getUserLogged, type UserLogged } from '$lib/api/endpoints/user';

  export const USER_CTX = Symbol('userQuery');

  const userQuery = createQuery<UserLogged, Error>(() => ({
    queryKey: ['user'] as const,
    queryFn: getUserLogged,
    staleTime: 60_000,
  }));

  setContext(USER_CTX, userQuery);

  let { children } = $props();
</script>

{@render children()}
