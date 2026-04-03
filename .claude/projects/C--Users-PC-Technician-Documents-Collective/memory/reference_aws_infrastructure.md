---
name: AWS Infrastructure
description: EC2 instance, RDS endpoint, SSH access, and deployment details for SkillBrick API
type: reference
---

## EC2 Instance
- **Instance ID:** i-0c7aa5698d2a0e046
- **Name:** skillbrick-api
- **Public IP:** 16.58.182.221
- **Region:** us-east-2
- **AMI:** Amazon Linux 2023 (ARM64)
- **SSH key:** skillbrick-key (~/.ssh/skillbrick-key.pem)
- **SSH user:** ec2-user
- **Project path:** /home/ec2-user/collective
- **API .env:** /home/ec2-user/collective/apps/api/.env

SSH: `ssh -i ~/.ssh/skillbrick-key.pem ec2-user@16.58.182.221`

## RDS Database
- **Endpoint:** agently-db.cjy4y8qecmnq.us-east-2.rds.amazonaws.com:5432
- **Database name:** skillbrick
- **Credentials:** stored in EC2 .env file (not in memory for security)

## Domains
- **Frontend:** https://skillbrickai.com (Cloudflare Pages)
- **API:** https://api.skillbrickai.com (EC2)

## AWS CLI
- Authenticated as IAM user `claude` (account 041120912651)
