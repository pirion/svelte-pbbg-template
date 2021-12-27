<script context="module">
	export function load({ session }) {

		if (!session.user) {
			return {
				status: 302,
				redirect: `/`
			};
		}
		return {};
	}
</script>

<script>
    import { session } from '$app/stores';
</script>
    
<p>Welcome {$session.user.username}!</p>

<slot></slot>