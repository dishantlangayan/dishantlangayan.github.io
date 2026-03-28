---
sidebar_position: 3
---

# Event Broker Authentication

The SC CLI provides commands to authenticate with Event Brokers for managing and configuring broker resources. This includes both Solace Cloud Event Broker Services and self-managed Software Event Brokers.

The broker commands use SEMPv2 or Legacy SEMP and you authenticate with the broker using Basic authentication scheme.

:::note
This section covers Event Broker authentication. For Solace Cloud platform authentication using API Tokens, refer to the [Solace Cloud Authentication](./sc-authentication) documentation.
:::

## Overview

Broker authentication allows the SC CLI to make SEMP API calls to manage message VPNs, queues, topics, client profiles, and other broker resources. The CLI supports two authentication methods:

1. **Direct Basic Authentication** - Directly connect to any broker using SEMP credentials
2. **Cloud-Based Authentication** - Automatically retrieve credentials from Solace Cloud for Event Broker Services

## Authentication Methods

### When to Use Each Method

**Use Direct Basic Authentication when:**
- Working with self-managed Software Event Brokers
- You have direct network access to the broker's SEMP endpoint
- You want to manage credentials independently of Solace Cloud

**Use Cloud-Based Authentication when:**
- Working with Solace Cloud Event Broker Services
- You're already authenticated to Solace Cloud
- You want automatic credential retrieval and management

## Direct Broker Login (Basic Authentication)

Direct broker login authorizes the SC CLI to make SEMP API calls using basic HTTP authentication. This method works with any broker that has SEMP enabled.

To authenticate with a broker using basic authentication:

```bash
sc broker login basic --broker-name <broker-identifier> --semp-url <semp-endpoint> --semp-port <port>
```

### Required Information

You'll need the following information to authenticate:

- **Broker Name** - A unique identifier for this broker in the CLI
- **SEMP URL** - The SEMP endpoint URL (must start with `http://` or `https://`)
- **SEMP Port** - The SEMP port number (between 1-65535)
- **SEMP Username** - Username with appropriate SEMP permissions
- **SEMP Password** - Password for the SEMP user

### Command Flags

- `-b, --broker-name=<value>` - **(Required)** Name/identifier for the broker
- `-u, --semp-url=<value>` - **(Required)** SEMP endpoint URL
- `-p, --semp-port=<value>` - **(Required)** SEMP port number
- `-d, --set-default` - Set this broker as the default broker
- `--no-prompt` - Non-interactive mode using environment variables

### Interactive Mode

By default, the CLI prompts you for credentials:

```bash
sc broker login basic --broker-name dev-broker --semp-url https://localhost --semp-port 8080
```

You'll be prompted to enter:
- SEMP Username
- SEMP Password (input hidden)

### Non-Interactive Mode

For automation and CI/CD pipelines, use environment variables with the `--no-prompt` flag:

```bash
export SC_SEMP_USERNAME=admin
export SC_SEMP_PASSWORD=your-password

sc broker login basic --broker-name ci-broker --semp-url http://192.168.1.100 --semp-port 8080 --no-prompt
```

### Examples

**Basic login with interactive credential prompt:**
```bash
sc broker login basic --broker-name production-broker --semp-url https://broker.example.com --semp-port 943
```

**Login and set as default broker:**
```bash
sc broker login basic --broker-name default-broker --semp-url https://broker.example.com --semp-port 943 --set-default
```

**Non-interactive login for automation:**
```bash
sc broker login basic --broker-name ci-broker --semp-url http://192.168.1.100 --semp-port 8080 --no-prompt
```

### Credential Handling

- Credentials are encoded and encrypted before storage
- If a broker with the same name already exists, you'll be prompted to confirm overwrite
- With `--no-prompt`, existing brokers are automatically overwritten

## Cloud-Based Broker Login

Cloud-based login automatically retrieves SEMP credentials from Solace Cloud for Event Broker Services. This method requires that you're already authenticated to Solace Cloud.

:::note
**Prerequisite:** You must be authenticated to Solace Cloud first. Run `sc account login` before using this command.
:::

To authenticate with a Solace Cloud Event Broker Service:

```bash
sc broker login cloud --broker-name <broker-name>
```

### How It Works

The cloud-based login process:

1. Validates your Solace Cloud API authentication
2. Looks up the broker by name in your Solace Cloud account
3. Retrieves the SEMP endpoint, port, and credentials automatically
4. Stores the credentials locally with encryption

### Command Flags

- `-b, --broker-name=<value>` - **(Required)** Name of the broker in Solace Cloud
- `-o, --org-name=<value>` - Solace Cloud organization name (uses default if not specified)
- `-d, --set-default` - Set this broker as the default
- `--no-prompt` - Skip confirmation prompts for overwriting

### Examples

**Login using default Solace Cloud organization:**
```bash
sc broker login cloud --broker-name production-broker
```

**Login and set as default broker:**
```bash
sc broker login cloud --broker-name dev-broker --set-default
```

**Login with specific organization:**
```bash
sc broker login cloud --broker-name staging-broker --org-name my-org
```

**Non-interactive mode for automation:**
```bash
sc broker login cloud --broker-name prod --no-prompt
```

### Error Handling

Common errors you might encounter:

- **401 Unauthorized** - Cloud API authentication expired. Run `sc account login` again
- **403 Forbidden** - Insufficient permissions for the API token
- **404 Not Found** - Broker not found in Solace Cloud account
- **Network Errors** - Check connectivity to Solace Cloud

## Setting the Default Broker

Setting a default broker simplifies command execution by eliminating the need to specify `--broker-name` in every command.

```bash
sc broker login basic --broker-name my-broker --semp-url https://localhost --semp-port 8080 --set-default
```

Or with cloud-based login:

```bash
sc broker login cloud --broker-name my-broker --set-default
```

:::tip
This is useful if you primarily work with one broker and want to avoid specifying the `--broker-name` flag in every command.
:::

Once set, you can run broker commands without specifying the broker:

```bash
sc broker msgvpn list
```

Instead of:

```bash
sc broker msgvpn list --broker-name my-broker
```

## Managing Multiple Brokers

You can authenticate with multiple brokers and switch between them using the `--broker-name` flag in commands.

### Listing Authenticated Brokers

To view all brokers you've authenticated with:

```bash
sc broker login list
```

This displays a table with:
- **Broker Name** - The identifier you assigned
- **Auth Type** - Authentication type (BASIC)
- **SEMP Endpoint** - The SEMP URL
- **SEMP Port** - The SEMP port
- **Is Default** - Whether this is the default broker
- **Solace Cloud** - Whether credentials came from Solace Cloud

Example output:
```
Broker Name         Auth Type  SEMP Endpoint              SEMP Port  Is Default  Solace Cloud
production-broker   BASIC      https://broker.example.com 943        Yes         Yes
dev-broker          BASIC      https://localhost          8080
staging-broker      BASIC      https://staging.example.com 943                   Yes
```

### Using Specific Brokers in Commands

Target a specific broker using the `--broker-name` flag:

```bash
sc broker msgvpn list --broker-name production-broker
sc broker queue list --broker-name dev-broker
```

## Logging Out

To remove stored broker credentials, use the logout command. The CLI provides three ways to logout:

### Interactive Selection

Run the logout command without flags to interactively select brokers:

```bash
sc broker logout
```

This displays a checkbox list where you can:
- Navigate with arrow keys
- Select/deselect brokers with spacebar
- Confirm with Enter
- Cancel with Ctrl+C

Default brokers are marked with "(default)" in the list.

### Logout from Specific Broker

Remove credentials for a specific broker:

```bash
sc broker logout --broker-name dev-broker
```

You'll be prompted for confirmation before the credentials are removed.

### Logout from All Brokers

Remove all stored broker credentials:

```bash
sc broker logout --all
```

You'll be prompted for confirmation before all credentials are removed.

### Skip Confirmation

Use the `--no-prompt` flag to skip confirmation prompts:

```bash
sc broker logout --broker-name dev-broker --no-prompt
sc broker logout --all --no-prompt
```

## Where is the Authentication Information Stored?

All authenticated brokers are stored locally in the user's home directory: `~/.sc/brokers.json` on MacOS/Linux or `%USERPROFILE%\.sc\brokers.json` on Windows.

### Security

Credentials are stored securely using the same encryption mechanism as Solace Cloud authentication:

- **Encryption:** AES-256-GCM encryption
- **Key Storage:** Master key stored in OS keychain
- **Machine Binding:** Combined with machine ID for enhanced security

This security model provides:

1. **Strong Security** - OS-level protection through native secure storage
2. **Machine-Bound Encryption** - Credentials can't be transferred to other machines
3. **Industry Standard** - AES-256-GCM is a widely trusted encryption algorithm

The CLI uses your operating system's native secure storage:

- **macOS:** Keychain
- **Windows:** Credential Manager
- **Linux:** Secret Service API (libsecret)
