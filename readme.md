# Jarg - Just another restic GUI

## What is it?

As the name implies, this is a graphical user interface for the backup tool "[restic](https://restic.net)". Restic is a great deduplicating, encrypting backup tool with quite a few possible backup destinations, such as 

* Local directory
* sftp
* REST server
* AWS S3 (either from Amazon or using the Minio server)
* OpenStack Swift
* BackBlaze B2
* Microsoft Azure Blob Storage
* Google Cloud Storage

While restic is great for batch usage, the commands are somewhat tedious to remember and enter id you  want to use it manually. That's where Jarg comes in:
Jarg is a small electron app which does not more than hide the restic commandline behind an easy to use graphical tool. So you need restic installed in order to use Jarg.

## Installation

* Install [restic](https://restic.readthedocs.io/en/stable/020_installation.html) for your operating system
* Download Jarg for your operating system. 

## Usage

### Concepts

