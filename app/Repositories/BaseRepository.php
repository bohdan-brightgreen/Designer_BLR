<?php
namespace App\Repositories;

date_default_timezone_set('Australia/Melbourne');

class BaseRepository
{
    public function sortByName($a, $b)
    {
        return strcmp($a['name'], $b['name']);
    }

    /**
     * Automatically assign allowed fields to model
     *
     * @param  object  $model        Model to assign fields
     * @param  array   $data         Data to assign
     * @param  array   $validFields  (optional) Allowed fields. All fields allowed if empty
     * @return object
     */
    public function assignFields($model, array $data, array $validFields = [])
    {
        foreach ($data as $field => $value) {
            if (!empty($validFields) && !in_array($field, $validFields)) {
                continue;
            }

            if ($field == 'password') {
                if (empty($value)) {
                    continue;
                }
                $value = $this->hashPassword($value);

            } else if ($field == 'email') {
                $value = $this->prepareEmail($value);
            }

            $model->$field = $value;
        }

        return $model;
    }

    /**
     * Remove not permitted data from array
     *
     * @param  array  $data         Data to clean
     * @param  array  $validFields  Allowed fields. All fields allowed if empty
     * @return array
     */
    public function cleanFields(array $data, array $validFields)
    {
        foreach ($data as $field => $value) {
            if (!in_array($field, $validFields)) {
                unset($data[$field]);
            }
        }

        return $data;
    }

    /**
     * Check if all required fields are exist
     *
     * @param  array  $data         Data to check
     * @param  array  $checkFields  Fields that must exist
     * @return boolean
     */
    public function isFieldsExists(array $data, array $checkFields)
    {
        foreach ($checkFields as $field) {
            if (!isset($data[$field])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if all required fields are exist and not empty
     *
     * @param  array  $data         Data to check
     * @param  array  $checkFields  Fields that must not be empty
     * @return boolean
     */
    public function isEmptyFields(array $data, array $checkFields)
    {
        $data = $this->trimArray($data);

        foreach ($checkFields as $field) {
            if (empty($data[$field])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Hash password
     *
     * @param  string  $password  Password to hash
     * @return string
     */
    public function hashPassword($password)
    {
        return bcrypt($password, ['rounds' => 12]);
    }

    /**
     * Prepare email address to one standard view
     *
     * @param  string  $email  Email address
     * @return string
     */
    public function prepareEmail($email)
    {
        return preg_replace('/\s+/', '', strtolower($email));
    }

    /**
     * Trim all elements of array
     *
     * @param  array  $data  Array to trim
     * @return array
     */
    public function trimArray(array $data)
    {
        return array_map('trim', $data);
    }

    /**
     * Transform variable to boolean
     *
     * @param  mixed  $var  Variable to transform
     * @return bool
     */
    public function toBool($var)
    {
        return filter_var($var, FILTER_VALIDATE_BOOLEAN);
    }
}