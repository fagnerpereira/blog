---
layout: post
title: "Rails updates methods guide"
date: 2024-10-05 02:47:16 -0300
categories: updates
---

## Guide to update attributes in rails

Everytime I have to implement some specific attribute update I search on google about how to use `update`, `update_attribute`, `update_attributes`, or `update_columns`. I know it seens silly, but if you dont really understand how to use each one you are going to face some bad surprises as me.

## Setting Up Our Example

Let's start by creating a `User` model that we'll use as a base to explain each update method:

```ruby
class User < ApplicationRecord
  validates :name, presence: true

  before_save :normalize_name

  private

  def normalize_name
    self.name = name.strip.titleize
  end
end
```

In this example, we've created a `User` model that validates the presence of a name and includes a callback to normalize the name before saving. Don't focus too much on the logic itself; this is just to serve as a basis for the examples we'll see next.

Let's create our `User`:

```ruby
user = User.create(name: "love Rails ")
user.name # => "Love Rails"
```

### 1. `update(attributes)`

This is probably the most common method in our day-to-day work for updating an object.

```ruby
user.update(name: "") # => false
user.update(name: "hate rails") # => true
user.name # => "Hate Rails"
```

When we run the above example using `update`, this is what happens:
1. It runs validations, returning `false` after trying to pass an empty `name`.
2. It runs the registered callbacks, in this case `before_save`, transforming the `name` "hate rails" into "Hate Rails" and returning `true` after successfully saving to the database.

`update!(attributes)` works in the same logic except it would return an exception instead of a boolean.

Note: `update_attributes` and `update_attributes!` are simply aliases to `update` and `update!` respectively, which have been deprecated since Rails 6.1.

### 2. `update_attribute(name, value)`

Note that it's `update_attribute`, not `_attributes`, because they have completely different behaviors.

```ruby
user.update_attribute(:name, "") # => true
user.update_attribute(:name, "love rails again ") # => true
user.name # => "Love Rails Again"
```

Here's what just happened:
1. Validations are skipped, allowing to save `name` with an empty string.
2. Callbacks run, normalizing the name as expected.
3. The `updated_at` column is also updated with the time of the last update.

### 3. `update_columns(attributes)`

```ruby
user.update_columns(name: "") # => true
user.update_columns(name: "hate update columns") # => true
user.name # => "hate update columns"
```

1. Validations are skipped.
2. Callbacks are skipped, so no normalization occurs.
3. `updated_at` is not updated.

As the documentation describes: "This is the fastest way to update attributes because it goes straight to the database, but take into account that in consequence the regular update procedures are totally bypassed."

While there might be situations where this is acceptable, it often results in bugs due to bypassing important model logic.

