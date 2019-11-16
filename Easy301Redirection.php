<?php

namespace WordpressEasy301Redirects;

use DateTime;
use Serializable;
use JsonSerializable;

/**
 * EasyRedirection Object for Easy301Redirects
 *
 */
class EasyRedirection implements Serializable, JsonSerializable
{
    /** @var string $uuid */
    public $id;
    /** @var string $request */
    public $request;
    /** @var string $destination */
    private $destination;
    /** @var DateTime $createdAt */
    private $createdAt;
    /** @var DateTime $modifiedAt */
    private $modifiedAt;
    /** @var int $order */
    private $order;

    public function __construct(string $request, string $destination, string $uuid = '', int $order = 0, DateTime $createdAt = null) {       
        $this->id = $uuid;
        $this->request = trim( sanitize_text_field($request) );
        $this->destination = trim( sanitize_text_field($destination) );
        $this->order = $order;
        $this->createdAt = $createdAt ?? new DateTime();        
    }

    public function serialize() : string
    {
        $arr = [
            'id' => $this->id,
            'request' => $this->request,
            'destination' => $this->destination,
            'order' => $this->order,
            'creation_date' => $this->createdAt->format(DateTime::ISO8601),
        ];
        if ( $this->modifiedAt ) $arr['modified_date'] = $this->modifiedAt->format(DateTime::ISO8601);
        return serialize($arr);
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'request' => $this->request,
            'destination' => $this->destination,
            'modificationDate' => $this->getModificationDate()->format('m-d-y H:i:s'),
            'order' => $this->order,           
        ];
    }

    public function unserialize($data) : EasyRedirection
    {
        $arr = unserialize($data);
        $this->id = $arr['id'];
        $this->request = $arr['request'];
        $this->destination = $arr['destination'];
        $this->order = $arr['order'];
        $this->createdAt = array_key_exists('creation_date', $arr) ? DateTime::createFromFormat(DateTime::ISO8601, $arr['creation_date']) : new DateTime();
        $this->modifiedAt = array_key_exists('modified_date', $arr) ? DateTime::createFromFormat(DateTime::ISO8601, $arr['modified_date']) : null;
        return $this;
    }

    public function getId() : string
    {
        return $this->id;
    }
    
    public function getOrder() : int
    {
        return $this->order ?? 0;
    }

    public function getRequest() : string
    {
        return $this->request;
    }

    public function setRequest(string $request) : bool
    {
        $request = trim( sanitize_text_field($request) );
        if ($request !== $this->request) {
            $this->request = $request;
            $this->modifiedAt = new DateTime();
            return true;
        }
        return false;
    }

    public function getDestination() : string
    {
        return $this->destination;
    }

    public function setDestination(string $destination) : bool
    {
        $destination = trim( sanitize_text_field($destination) );
        if ($destination !== $this->destination) {
            $this->destination = $destination;
            $this->modifiedAt = new DateTime();
            return true;
        }
        return false;
    }

    public function getCreationDate() : DateTime
    {
        return $this->createdAt;
    }

    public function getModificationDate() : DateTime
    {
        return $this->modifiedAt ?? $this->createdAt;
    }

    public function getCSVrow () : array
    {
        $row = [
            trim( sanitize_text_field($this->request )), 
            trim( sanitize_text_field($this->destination)), 
            $this->createdAt->format('Y-m-d H:i:s'),            
            $this->getModificationDate()->format('Y-m-d H:i:s'),
        ];
        return $row;
    }
}